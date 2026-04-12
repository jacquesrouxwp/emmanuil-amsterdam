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

// --- Share: inline query system ---

const OPEN_APP_LABEL = {
  ua: '📱 Відкрити у додатку',
  ru: '📱 Открыть в приложении',
  en: '📱 Open in app',
  nl: '📱 Open in app',
  es: '📱 Abrir en la app',
};
const MORE_IN_APP = {
  ua: '📲 Повний пост у нашому міні-додатку',
  ru: '📲 Полный пост в нашем мини-приложении',
  en: '📲 Full post in our mini app',
  nl: '📲 Volledig bericht in onze mini-app',
  es: '📲 Publicación completa en nuestra mini-app',
};

// In-memory cache for share data (key = random id, expires after 5 min)
const shareCache = {};

app.post('/api/share/cache', (req, res) => {
  const { title, body, photoUrl, lang } = req.body;
  if (!title) return res.status(400).json({ error: 'title required' });
  const key = Math.random().toString(36).slice(2, 10);
  shareCache[key] = { title, body, photoUrl, lang, ts: Date.now() };
  // Clean old entries
  for (const k of Object.keys(shareCache)) {
    if (Date.now() - shareCache[k].ts > 5 * 60 * 1000) delete shareCache[k];
  }
  res.json({ key });
});

// Prepare a share message via savePreparedInlineMessage (Bot API 7.10)
app.post('/api/share/prepare', async (req, res) => {
  try {
    const { userId, title, body, photoUrl, lang } = req.body;
    if (!userId || !title) return res.status(400).json({ error: 'userId and title required' });

    const BOT_TOKEN = process.env.BOT_TOKEN;
    if (!BOT_TOKEN) return res.status(500).json({ error: 'BOT_TOKEN not set' });

    const l = lang && MORE_IN_APP[lang] ? lang : 'ru';
    const snippet = body ? body.substring(0, 200) + (body.length > 200 ? '...' : '') : '';
    const caption = snippet
      ? `<b>${title}</b>\n\n${snippet}\n\n${MORE_IN_APP[l]}`
      : `<b>${title}</b>\n\n${MORE_IN_APP[l]}`;

    const btnLabel = OPEN_APP_LABEL[l] || OPEN_APP_LABEL.ru;
    const replyMarkup = {
      inline_keyboard: [[{ text: btnLabel, url: 'https://t.me/myconclaw_bot/app' }]],
    };

    let result;
    if (photoUrl) {
      result = {
        type: 'photo',
        id: '1',
        photo_url: photoUrl,
        thumbnail_url: photoUrl,
        caption,
        parse_mode: 'HTML',
        reply_markup: replyMarkup,
      };
    } else {
      result = {
        type: 'article',
        id: '1',
        title,
        description: snippet.substring(0, 100),
        input_message_content: { message_text: caption, parse_mode: 'HTML' },
        reply_markup: replyMarkup,
      };
    }

    const r = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/savePreparedInlineMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        result,
        allow_user_chats: true,
        allow_bot_chats: true,
        allow_group_chats: true,
        allow_channel_posts: true,
      }),
    });
    const data = await r.json();
    console.log('[share/prepare]', JSON.stringify(data));

    if (!data.ok) return res.status(500).json({ error: data.description });
    res.json({ preparedId: data.result.id });
  } catch (err) {
    console.error('prepare error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Telegram webhook — handles inline_query
app.post('/api/telegram/webhook', async (req, res) => {
  res.json({ ok: true }); // respond immediately

  const BOT_TOKEN = process.env.BOT_TOKEN;
  if (!BOT_TOKEN) return;

  const update = req.body;

  if (update.inline_query) {
    const query = update.inline_query.query.trim();
    const inlineId = update.inline_query.id;
    const cached = shareCache[query];

    if (!cached) {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerInlineQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inline_query_id: inlineId, results: [], cache_time: 0 }),
      });
      return;
    }

    const l = cached.lang && MORE_IN_APP[cached.lang] ? cached.lang : 'ru';
    const snippet = cached.body ? cached.body.substring(0, 180) + (cached.body.length > 180 ? '...' : '') : '';
    const caption = `${cached.title}\n\n${snippet}\n\n${MORE_IN_APP[l]}`;
    const btnLabel = OPEN_APP_LABEL[l] || OPEN_APP_LABEL.ru;
    const replyMarkup = { inline_keyboard: [[{ text: btnLabel, url: 'https://t.me/myconclaw_bot/app' }]] };

    const results = [];

    if (cached.photoUrl) {
      results.push({
        type: 'photo',
        id: '1',
        photo_url: cached.photoUrl,
        thumbnail_url: cached.photoUrl,
        caption,
        reply_markup: replyMarkup,
      });
    }

    // Always add a text-only result as backup
    results.push({
      type: 'article',
      id: '2',
      title: cached.title,
      description: snippet.substring(0, 80),
      input_message_content: { message_text: caption },
      reply_markup: replyMarkup,
    });

    const answerRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerInlineQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inline_query_id: inlineId, results, cache_time: 0, is_personal: true }),
    });
    const answerData = await answerRes.json();
    console.log('[webhook/inline]', answerData.ok ? 'OK' : answerData.description);

    // Clean up used cache entry
    delete shareCache[query];
  }
});

// Register webhook on startup
async function registerWebhook() {
  const BOT_TOKEN = process.env.BOT_TOKEN;
  if (!BOT_TOKEN) {
    console.log('[webhook] skipping — BOT_TOKEN not set');
    return;
  }
  const webhookUrl = 'https://emmanuil-amsterdam.onrender.com/api/telegram/webhook';
  try {
    const r = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: webhookUrl, allowed_updates: ['inline_query'] }),
    });
    const data = await r.json();
    console.log('[webhook]', data.ok ? `registered: ${webhookUrl}` : data.description);
  } catch (err) {
    console.log('[webhook] error:', err.message);
  }
}

// --- Share page: OG meta for rich Telegram previews ---

// Key-based share page (used by BlogFeed share button)
app.get('/share/:key', (req, res) => {
  const cached = shareCache[req.params.key];
  if (!cached) return res.redirect('https://t.me/myconclaw_bot/app');

  const title = cached.title || 'Emmanuil Amsterdam';
  const l = cached.lang && MORE_IN_APP[cached.lang] ? cached.lang : 'ru';
  const snippet = cached.body ? cached.body.substring(0, 200) + (cached.body.length > 200 ? '...' : '') : '';
  const fullDesc = snippet ? `${snippet}\n\n${MORE_IN_APP[l]}` : MORE_IN_APP[l];
  const image = cached.photoUrl || '';

  const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

  res.send(`<!DOCTYPE html>
<html><head>
<meta charset="utf-8">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(fullDesc)}">
${image ? `<meta property="og:image" content="${esc(image)}">
<meta property="og:image:width" content="800">
<meta property="og:image:height" content="600">` : ''}
<meta property="og:type" content="article">
<meta property="og:site_name" content="Emmanuil Amsterdam">
<meta property="og:url" content="https://t.me/myconclaw_bot/app">
<meta http-equiv="refresh" content="0;url=https://t.me/myconclaw_bot/app">
<title>${esc(title)}</title>
</head><body><p>Redirecting...</p></body></html>`);
});

app.get('/post', (req, res) => {
  const title = (req.query.t || 'Emmanuil Amsterdam').toString();
  const desc = (req.query.d || '').toString();
  const image = (req.query.img || '').toString();
  const l = (req.query.l || 'ru').toString();
  const moreText = MORE_IN_APP[l] || MORE_IN_APP.ru;
  const fullDesc = desc ? `${desc}\n\n${moreText}` : moreText;

  const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

  res.send(`<!DOCTYPE html>
<html><head>
<meta charset="utf-8">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(fullDesc)}">
${image ? `<meta property="og:image" content="${esc(image)}">
<meta property="og:image:width" content="800">
<meta property="og:image:height" content="600">` : ''}
<meta property="og:type" content="article">
<meta property="og:site_name" content="Emmanuil Amsterdam">
<meta property="og:url" content="https://t.me/myconclaw_bot/app">
<meta http-equiv="refresh" content="0;url=https://t.me/myconclaw_bot/app">
<title>${esc(title)}</title>
</head><body><p>Redirecting...</p></body></html>`);
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
  registerWebhook();
});
