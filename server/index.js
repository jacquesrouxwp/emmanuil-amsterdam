import express from 'express';
import cors from 'cors';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = process.env.DATA_FILE || '/tmp/emmanuil-data.json';
const DIST_DIR = join(__dirname, '..', 'dist');
const PORT = process.env.PORT || 3002;

const app = express();
app.use(cors());
app.use(express.json());

// --- Serve frontend (production build) ---
if (existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
}

// --- Simple JSON file storage ---

function loadData() {
  if (!existsSync(DATA_FILE)) return { attendance: {}, subscribers: [], reactions: {} };
  try {
    const d = JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
    if (!d.subscribers) d.subscribers = [];
    if (!d.reactions) d.reactions = {};
    return d;
  } catch {
    return { attendance: {}, subscribers: [], reactions: {} };
  }
}

function saveData(data) {
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// --- API Routes ---

app.get('/api/attendance', (_req, res) => {
  const data = loadData();
  const result = {};
  for (const [groupId, attendees] of Object.entries(data.attendance)) {
    result[groupId] = {
      count: attendees.length,
      attendees: attendees.map(({ name, photo }) => ({ name, photo })),
    };
  }
  res.json(result);
});

app.get('/api/attendance/:groupId', (req, res) => {
  const data = loadData();
  const attendees = data.attendance[req.params.groupId] || [];
  res.json({
    count: attendees.length,
    attendees: attendees.map(({ name, photo }) => ({ name, photo })),
  });
});

app.post('/api/attendance/:groupId/toggle', (req, res) => {
  try {
    const { userId, name, photo } = req.body;
    if (!userId || !name) {
      return res.status(400).json({ error: 'userId and name required' });
    }

    const data = loadData();
    if (!data.attendance[req.params.groupId]) {
      data.attendance[req.params.groupId] = [];
    }

    const group = data.attendance[req.params.groupId];
    const idx = group.findIndex((a) => a.userId === userId);

    let isAttending;
    if (idx >= 0) {
      group.splice(idx, 1);
      isAttending = false;
    } else {
      group.push({ userId, name, photo: photo || null });
      isAttending = true;
    }

    saveData(data);

    res.json({
      isAttending,
      count: group.length,
      attendees: group.map(({ name, photo }) => ({ name, photo })),
    });
  } catch (err) {
    console.error('Toggle error:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// --- Post reactions (likes / shares) ---

app.get('/api/reactions', (_req, res) => {
  const data = loadData();
  res.json(data.reactions);
});

app.post('/api/reactions/:postId/like', (req, res) => {
  const { postId } = req.params;
  const { delta } = req.body; // +1 or -1
  const data = loadData();
  if (!data.reactions[postId]) data.reactions[postId] = { likes: 0, shares: 0 };
  data.reactions[postId].likes = Math.max(0, (data.reactions[postId].likes || 0) + (delta === -1 ? -1 : 1));
  saveData(data);
  res.json(data.reactions[postId]);
});

app.post('/api/reactions/:postId/share', (req, res) => {
  const { postId } = req.params;
  const data = loadData();
  if (!data.reactions[postId]) data.reactions[postId] = { likes: 0, shares: 0 };
  data.reactions[postId].shares = (data.reactions[postId].shares || 0) + 1;
  saveData(data);
  res.json(data.reactions[postId]);
});

// --- Share: prepare inline message with photo via Telegram Bot API ---

const OPEN_APP_LABEL = {
  ua: '📱 Відкрити пост у додатку',
  ru: '📱 Открыть пост в приложении',
  en: '📱 Open post in app',
  nl: '📱 Open bericht in app',
  es: '📱 Abrir publicación en la app',
};
const MORE_IN_APP = {
  ua: '📲 Повний пост у нашому міні-додатку',
  ru: '📲 Полный пост в нашем мини-приложении',
  en: '📲 Full post in our mini app',
  nl: '📲 Volledig bericht in onze mini-app',
  es: '📲 Publicación completa en nuestra mini-app',
};

app.post('/api/share/prepare', async (req, res) => {
  try {
    const BOT_TOKEN = process.env.BOT_TOKEN;
    if (!BOT_TOKEN) return res.status(500).json({ error: 'BOT_TOKEN not set' });

    const { userId, title, body, photoUrl, lang } = req.body;
    if (!userId || !title) return res.status(400).json({ error: 'userId and title required' });

    const l = lang && MORE_IN_APP[lang] ? lang : 'ru';
    const snippet = body ? body.substring(0, 180) + (body.length > 180 ? '...' : '') : '';
    const caption = `${title}\n\n${snippet}\n\n${MORE_IN_APP[l]}`;
    const btnLabel = OPEN_APP_LABEL[l] || OPEN_APP_LABEL.ru;

    const replyMarkup = {
      inline_keyboard: [[{ text: btnLabel, url: 'https://t.me/myconclaw_bot/app' }]],
    };

    let result;

    if (photoUrl) {
      // Upload photo to Telegram to get a stable file_id, then delete the temp message
      const uploadRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: userId, photo: photoUrl, disable_notification: true }),
      });
      const uploadData = await uploadRes.json();

      if (uploadData.ok) {
        const msgId = uploadData.result.message_id;
        // Delete immediately so user doesn't see it
        fetch(`https://api.telegram.org/bot${BOT_TOKEN}/deleteMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: userId, message_id: msgId }),
        }).catch(() => {});

        const fileId = uploadData.result.photo[uploadData.result.photo.length - 1].file_id;
        result = { type: 'photo', id: 'share', photo_file_id: fileId, caption, parse_mode: 'HTML', reply_markup: replyMarkup };
      }
    }

    if (!result) {
      result = {
        type: 'article', id: 'share', title,
        input_message_content: { message_text: caption },
        reply_markup: replyMarkup,
      };
    }

    const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/savePreparedInlineMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, result, allow_user_chats: true, allow_group_chats: true, allow_channel_chats: true }),
    });

    const tgData = await tgRes.json();
    if (!tgData.ok) return res.status(400).json({ error: tgData.description });
    res.json({ id: tgData.result.id });
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// --- Subscribe: save chat_id when user opens the app ---

app.post('/api/subscribe', (req, res) => {
  try {
    const { chatId, name } = req.body;
    if (!chatId) return res.status(400).json({ error: 'chatId required' });

    const data = loadData();
    const exists = data.subscribers.find((s) => s.chatId === chatId);
    if (!exists) {
      data.subscribers.push({ chatId, name: name || '', subscribedAt: new Date().toISOString() });
      saveData(data);
    }
    res.json({ ok: true, total: data.subscribers.length });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Notify: broadcast message to all subscribers ---

app.post('/api/notify', async (req, res) => {
  try {
    const { secret, text } = req.body;
    const ADMIN_SECRET = process.env.ADMIN_SECRET;

    if (!ADMIN_SECRET || secret !== ADMIN_SECRET) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'text required' });
    }

    const BOT_TOKEN = process.env.BOT_TOKEN;
    if (!BOT_TOKEN) return res.status(500).json({ error: 'BOT_TOKEN not set' });

    const data = loadData();
    const subscribers = data.subscribers;

    let sent = 0;
    let failed = 0;

    for (const sub of subscribers) {
      try {
        const r = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: sub.chatId,
            text,
            parse_mode: 'HTML',
          }),
        });
        if (r.ok) sent++;
        else failed++;
      } catch {
        failed++;
      }
    }

    res.json({ ok: true, sent, failed, total: subscribers.length });
  } catch (err) {
    console.error('Notify error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Subscriber count (for admin UI) ---

app.get('/api/subscribers/count', (req, res) => {
  const { secret } = req.query;
  const ADMIN_SECRET = process.env.ADMIN_SECRET;
  if (!ADMIN_SECRET || secret !== ADMIN_SECRET) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const data = loadData();
  res.json({ count: data.subscribers.length });
});

// --- Volunteer form → send Telegram message to direction leader ---

app.post('/api/volunteer', async (req, res) => {
  try {
    const { direction, directionLabel, name, comment, telegramUsername, telegramId } = req.body;
    if (!direction || !name) return res.status(400).json({ error: 'direction and name required' });

    const BOT_TOKEN = process.env.BOT_TOKEN;

    // Each direction maps to its leader's Telegram chat_id env var
    const leaderMap = {
      worship:    process.env.LEADER_WORSHIP,
      children:   process.env.LEADER_CHILDREN,
      media:      process.env.LEADER_MEDIA,
      evangelism: process.env.LEADER_EVANGELISM,
    };

    const chatId = leaderMap[direction] || process.env.LEADER_DEFAULT;

    if (BOT_TOKEN && chatId) {
      const userLine = telegramUsername
        ? `👤 <b>${name}</b> (@${telegramUsername})`
        : `👤 <b>${name}</b>`;

      const text =
        `🙋 <b>Нова заявка у служіння!</b>\n\n` +
        `📌 Напрямок: <b>${directionLabel}</b>\n` +
        `${userLine}\n\n` +
        (comment ? `💬 <i>${comment}</i>` : '');

      // If we have the user's Telegram ID — add a button to open direct chat
      const replyMarkup = telegramId ? {
        inline_keyboard: [[
          { text: `💬 Написати ${name}`, url: `tg://user?id=${telegramId}` }
        ]]
      } : undefined;

      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'HTML',
          ...(replyMarkup ? { reply_markup: replyMarkup } : {}),
        }),
      });
    }

    res.json({ ok: true });
  } catch (err) {
    console.error('Volunteer error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// --- SPA fallback: serve index.html for all non-API routes ---
if (existsSync(DIST_DIR)) {
  app.get('*', (_req, res) => {
    res.sendFile(join(DIST_DIR, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Emmanuil Amsterdam running on port ${PORT}`);
});
