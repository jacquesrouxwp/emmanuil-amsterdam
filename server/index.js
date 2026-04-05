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
  if (!existsSync(DATA_FILE)) return { attendance: {} };
  try {
    return JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
  } catch {
    return { attendance: {} };
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

// --- SPA fallback: serve index.html for all non-API routes ---
if (existsSync(DIST_DIR)) {
  app.get('*', (_req, res) => {
    res.sendFile(join(DIST_DIR, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Emmanuil Amsterdam running on port ${PORT}`);
});
