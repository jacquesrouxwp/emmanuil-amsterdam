import express from 'express';
import cors from 'cors';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import { MongoClient } from 'mongodb';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_DIR = join(__dirname, '..', 'dist');
const PORT = process.env.PORT || 3002;

const app = express();
app.use(cors());
app.use(express.json());

// --- MongoDB connection ---

const MONGODB_URI = process.env.MONGODB_URI;
let db = null;

async function connectDB() {
  if (!MONGODB_URI) {
    console.log('[db] MONGODB_URI not set — skipping MongoDB');
    return;
  }
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db('emmanuil');
    console.log('[db] Connected to MongoDB');
  } catch (err) {
    console.error('[db] Connection failed:', err.message);
  }
}

// Helper: get reaction doc for a post
async function getReaction(postId) {
  if (!db) return { likes: 0, shares: 0 };
  const doc = await db.collection('reactions').findOne({ _id: postId });
  return doc ? { likes: doc.likes || 0, shares: doc.shares || 0 } : { likes: 0, shares: 0 };
}

// --- Serve frontend ---
if (existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
}

// --- Attendance ---

app.get('/api/attendance', async (_req, res) => {
  try {
    const result = {};
    if (db) {
      const docs = await db.collection('attendance').find({}).toArray();
      for (const doc of docs) {
        result[doc._id] = {
          count: doc.attendees.length,
          attendees: doc.attendees.map(({ name, photo }) => ({ name, photo })),
        };
      }
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/attendance/:groupId', async (req, res) => {
  try {
    const doc = db ? await db.collection('attendance').findOne({ _id: req.params.groupId }) : null;
    const attendees = doc?.attendees || [];
    res.json({ count: attendees.length, attendees: attendees.map(({ name, photo }) => ({ name, photo })) });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/attendance/:groupId/toggle', async (req, res) => {
  try {
    const { userId, name, photo } = req.body;
    if (!userId || !name) return res.status(400).json({ error: 'userId and name required' });
    if (!db) return res.status(503).json({ error: 'DB not connected' });

    const groupId = req.params.groupId;
    const doc = await db.collection('attendance').findOne({ _id: groupId });
    const attendees = doc?.attendees || [];
    const idx = attendees.findIndex((a) => a.userId === userId);

    let isAttending;
    if (idx >= 0) {
      attendees.splice(idx, 1);
      isAttending = false;
    } else {
      attendees.push({ userId, name, photo: photo || null });
      isAttending = true;
    }

    await db.collection('attendance').updateOne(
      { _id: groupId },
      { $set: { attendees } },
      { upsert: true }
    );

    res.json({ isAttending, count: attendees.length, attendees: attendees.map(({ name, photo }) => ({ name, photo })) });
  } catch (err) {
    console.error('Toggle error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Reactions ---

app.get('/api/reactions', async (_req, res) => {
  try {
    const result = {};
    if (db) {
      const docs = await db.collection('reactions').find({}).toArray();
      for (const doc of docs) {
        result[doc._id] = { likes: doc.likes || 0, shares: doc.shares || 0 };
      }
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/reactions/:postId/like', async (req, res) => {
  try {
    const { postId } = req.params;
    const delta = req.body.delta === -1 ? -1 : 1;
    if (!db) return res.json({ likes: 0, shares: 0 });

    const doc = await db.collection('reactions').findOneAndUpdate(
      { _id: postId },
      { $inc: { likes: delta }, $setOnInsert: { shares: 0 } },
      { upsert: true, returnDocument: 'after' }
    );
    const updated = doc || await getReaction(postId);
    // Ensure likes >= 0
    if (updated.likes < 0) {
      await db.collection('reactions').updateOne({ _id: postId }, { $set: { likes: 0 } });
      updated.likes = 0;
    }
    res.json({ likes: updated.likes || 0, shares: updated.shares || 0 });
  } catch (err) {
    console.error('Like error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/reactions/:postId/share', async (req, res) => {
  try {
    const { postId } = req.params;
    if (!db) return res.json({ likes: 0, shares: 0 });

    const doc = await db.collection('reactions').findOneAndUpdate(
      { _id: postId },
      { $inc: { shares: 1 }, $setOnInsert: { likes: 0 } },
      { upsert: true, returnDocument: 'after' }
    );
    const updated = doc || await getReaction(postId);
    res.json({ likes: updated.likes || 0, shares: updated.shares || 0 });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Comments ---

app.get('/api/comments/:postId', async (req, res) => {
  try {
    const comments = db
      ? await db.collection('comments').find({ postId: req.params.postId }).sort({ createdAt: 1 }).toArray()
      : [];
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/comments/:postId', async (req, res) => {
  try {
    const { userId, name, photo, text } = req.body;
    if (!userId || !name || !text?.trim()) {
      return res.status(400).json({ error: 'userId, name and text required' });
    }
    if (!db) return res.status(503).json({ error: 'DB not connected' });

    const comment = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      postId: req.params.postId,
      userId,
      name,
      photo: photo || null,
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };

    await db.collection('comments').insertOne({ ...comment, _id: comment.id });
    res.json(comment);
  } catch (err) {
    console.error('Comment error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Subscribe ---

app.post('/api/subscribe', async (req, res) => {
  try {
    const { chatId, name } = req.body;
    if (!chatId) return res.status(400).json({ error: 'chatId required' });
    if (!db) return res.json({ ok: true, total: 0 });

    await db.collection('subscribers').updateOne(
      { chatId },
      { $setOnInsert: { chatId, name: name || '', subscribedAt: new Date().toISOString() } },
      { upsert: true }
    );
    const total = await db.collection('subscribers').countDocuments();
    res.json({ ok: true, total });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Notify ---

app.post('/api/notify', async (req, res) => {
  try {
    const { secret, text } = req.body;
    const ADMIN_SECRET = process.env.ADMIN_SECRET;
    if (!ADMIN_SECRET || secret !== ADMIN_SECRET) return res.status(403).json({ error: 'Forbidden' });
    if (!text?.trim()) return res.status(400).json({ error: 'text required' });

    const BOT_TOKEN = process.env.BOT_TOKEN;
    if (!BOT_TOKEN) return res.status(500).json({ error: 'BOT_TOKEN not set' });
    if (!db) return res.status(503).json({ error: 'DB not connected' });

    const subscribers = await db.collection('subscribers').find({}).toArray();
    let sent = 0, failed = 0;

    for (const sub of subscribers) {
      try {
        const r = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: sub.chatId, text, parse_mode: 'HTML' }),
        });
        if (r.ok) sent++; else failed++;
      } catch { failed++; }
    }
    res.json({ ok: true, sent, failed, total: subscribers.length });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/subscribers/count', async (req, res) => {
  const { secret } = req.query;
  const ADMIN_SECRET = process.env.ADMIN_SECRET;
  if (!ADMIN_SECRET || secret !== ADMIN_SECRET) return res.status(403).json({ error: 'Forbidden' });
  const count = db ? await db.collection('subscribers').countDocuments() : 0;
  res.json({ count });
});

// --- Volunteer ---

app.post('/api/volunteer', async (req, res) => {
  try {
    const { direction, directionLabel, name, comment, telegramUsername, telegramId } = req.body;
    if (!direction || !name) return res.status(400).json({ error: 'direction and name required' });

    const BOT_TOKEN = process.env.BOT_TOKEN;
    const leaderMap = {
      worship:    process.env.LEADER_WORSHIP,
      children:   process.env.LEADER_CHILDREN,
      media:      process.env.LEADER_MEDIA,
      evangelism: process.env.LEADER_EVANGELISM,
    };
    const chatId = leaderMap[direction] || process.env.LEADER_DEFAULT;

    if (BOT_TOKEN && chatId) {
      const userLine = telegramUsername ? `👤 <b>${name}</b> (@${telegramUsername})` : `👤 <b>${name}</b>`;
      const text = `🙋 <b>Нова заявка у служіння!</b>\n\n📌 Напрямок: <b>${directionLabel}</b>\n${userLine}\n\n` +
        (comment ? `💬 <i>${comment}</i>` : '');
      const replyMarkup = telegramId ? { inline_keyboard: [[{ text: `💬 Написати ${name}`, url: `tg://user?id=${telegramId}` }]] } : undefined;

      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', ...(replyMarkup ? { reply_markup: replyMarkup } : {}) }),
      });
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Share: send post directly to user's bot chat ---

app.post('/api/share/send-to-user', async (req, res) => {
  try {
    const { userId, title, body, photoUrl, lang } = req.body;
    if (!userId || !title) return res.status(400).json({ error: 'userId and title required' });

    const BOT_TOKEN = process.env.BOT_TOKEN;
    if (!BOT_TOKEN) return res.status(500).json({ error: 'BOT_TOKEN not set' });

    const l = lang && MORE_IN_APP[lang] ? lang : 'ru';
    const snippet = body ? body.substring(0, 300) + (body.length > 300 ? '...' : '') : '';
    const caption = snippet
      ? `<b>${title}</b>\n\n${snippet}\n\n${MORE_IN_APP[l]}`
      : `<b>${title}</b>\n\n${MORE_IN_APP[l]}`;

    const replyMarkup = {
      inline_keyboard: [[{ text: OPEN_APP_LABEL[l] || OPEN_APP_LABEL.ru, url: 'https://t.me/myconclaw_bot/app' }]],
    };

    let result;
    if (photoUrl) {
      result = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: userId,
          photo: photoUrl,
          caption,
          parse_mode: 'HTML',
          reply_markup: replyMarkup,
        }),
      });
    } else {
      result = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: userId,
          text: caption,
          parse_mode: 'HTML',
          reply_markup: replyMarkup,
        }),
      });
    }

    const data = await result.json();
    console.log('[share/send-to-user]', data.ok ? 'OK' : data.description);
    if (!data.ok) return res.status(500).json({ error: data.description });
    res.json({ ok: true, messageId: data.result.message_id });
  } catch (err) {
    console.error('send-to-user error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Share ---

const OPEN_APP_LABEL = {
  ua: '📱 Emmanuil App', ru: '📱 Emmanuil App',
  en: '📱 Emmanuil App', nl: '📱 Emmanuil App', es: '📱 Emmanuil App',
};
const MORE_IN_APP = {
  ua: '📲 Повний пост у нашому міні-додатку',
  ru: '📲 Полный пост в нашем мини-приложении',
  en: '📲 Full post in our mini app',
  nl: '📲 Volledig bericht in onze mini-app',
  es: '📲 Publicación completa en nuestra mini-app',
};

const shareCache = {};

app.post('/api/share/cache', (req, res) => {
  const { title, body, photoUrl, lang } = req.body;
  if (!title) return res.status(400).json({ error: 'title required' });
  const key = Math.random().toString(36).slice(2, 10);
  shareCache[key] = { title, body, photoUrl, lang, ts: Date.now() };
  for (const k of Object.keys(shareCache)) {
    if (Date.now() - shareCache[k].ts > 5 * 60 * 1000) delete shareCache[k];
  }
  res.json({ key });
});

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

    const replyMarkup = { inline_keyboard: [[{ text: OPEN_APP_LABEL[l] || OPEN_APP_LABEL.ru, url: 'https://t.me/myconclaw_bot/app' }]] };

    const result = photoUrl
      ? { type: 'photo', id: '1', photo_url: photoUrl, thumbnail_url: photoUrl, caption, parse_mode: 'HTML', reply_markup: replyMarkup }
      : { type: 'article', id: '1', title, description: snippet.substring(0, 100), input_message_content: { message_text: caption, parse_mode: 'HTML' }, reply_markup: replyMarkup };

    const r = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/savePreparedInlineMessage`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, result, allow_user_chats: true, allow_bot_chats: true, allow_group_chats: true, allow_channel_posts: true }),
    });
    const data = await r.json();
    console.log('[share/prepare]', JSON.stringify(data));
    if (!data.ok) return res.status(500).json({ error: data.description });
    res.json({ preparedId: data.result.id });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Telegram webhook ---

app.post('/api/telegram/webhook', async (req, res) => {
  res.json({ ok: true });
  const BOT_TOKEN = process.env.BOT_TOKEN;
  if (!BOT_TOKEN) return;

  const update = req.body;
  if (update.inline_query) {
    const query = update.inline_query.query.trim();
    const inlineId = update.inline_query.id;
    const cached = shareCache[query];

    if (!cached) {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerInlineQuery`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inline_query_id: inlineId, results: [], cache_time: 0 }),
      });
      return;
    }

    const l = cached.lang && MORE_IN_APP[cached.lang] ? cached.lang : 'ru';
    const snippet = cached.body ? cached.body.substring(0, 180) + (cached.body.length > 180 ? '...' : '') : '';
    const caption = `${cached.title}\n\n${snippet}\n\n${MORE_IN_APP[l]}`;
    const replyMarkup = { inline_keyboard: [[{ text: OPEN_APP_LABEL[l] || OPEN_APP_LABEL.ru, url: 'https://t.me/myconclaw_bot/app' }]] };
    const results = [];

    if (cached.photoUrl) {
      results.push({ type: 'photo', id: '1', photo_url: cached.photoUrl, thumbnail_url: cached.photoUrl, caption, reply_markup: replyMarkup });
    }
    results.push({ type: 'article', id: '2', title: cached.title, description: snippet.substring(0, 80), input_message_content: { message_text: caption }, reply_markup: replyMarkup });

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerInlineQuery`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inline_query_id: inlineId, results, cache_time: 0, is_personal: true }),
    });
    delete shareCache[query];
  }
});

// --- OG meta share pages ---

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

app.get('/share/:key', (req, res) => {
  const cached = shareCache[req.params.key];
  if (!cached) return res.redirect('https://t.me/myconclaw_bot/app');
  const l = cached.lang && MORE_IN_APP[cached.lang] ? cached.lang : 'ru';
  const snippet = cached.body ? cached.body.substring(0, 200) + (cached.body.length > 200 ? '...' : '') : '';
  const fullDesc = snippet ? `${snippet}\n\n${MORE_IN_APP[l]}` : MORE_IN_APP[l];
  res.send(`<!DOCTYPE html><html><head><meta charset="utf-8">
<meta property="og:title" content="${esc(cached.title || 'Emmanuil Amsterdam')}">
<meta property="og:description" content="${esc(fullDesc)}">
${cached.photoUrl ? `<meta property="og:image" content="${esc(cached.photoUrl)}">` : ''}
<meta property="og:type" content="article">
<meta http-equiv="refresh" content="0;url=https://t.me/myconclaw_bot/app">
</head><body></body></html>`);
});

// --- SPA fallback ---
if (existsSync(DIST_DIR)) {
  app.get('*', (_req, res) => res.sendFile(join(DIST_DIR, 'index.html')));
}

async function registerWebhook() {
  const BOT_TOKEN = process.env.BOT_TOKEN;
  if (!BOT_TOKEN) return console.log('[webhook] skipping — BOT_TOKEN not set');
  try {
    const r = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: 'https://emmanuil-amsterdam.onrender.com/api/telegram/webhook', allowed_updates: ['inline_query'] }),
    });
    const data = await r.json();
    console.log('[webhook]', data.ok ? 'registered' : data.description);
  } catch (err) {
    console.log('[webhook] error:', err.message);
  }
}

app.listen(PORT, async () => {
  console.log(`Emmanuil Amsterdam running on port ${PORT}`);
  await connectDB();
  registerWebhook();
});
