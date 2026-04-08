import { useState, useEffect } from 'react';
import { Send, Users, Lock } from 'lucide-react';

const API_URL = import.meta.env.PROD ? '' : 'http://localhost:3002';

export function AdminPage() {
  const [secret, setSecret] = useState('');
  const [authed, setAuthed] = useState(false);
  const [text, setText] = useState('');
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [sending, setSending] = useState(false);

  async function login() {
    try {
      const res = await fetch(`${API_URL}/api/subscribers/count?secret=${encodeURIComponent(secret)}`);
      if (res.ok) {
        const data = await res.json();
        setSubscriberCount(data.count);
        setAuthed(true);
      } else {
        setStatus({ type: 'error', msg: 'Невірний пароль' });
      }
    } catch {
      setStatus({ type: 'error', msg: 'Помилка з\'єднання' });
    }
  }

  async function sendNotification() {
    if (!text.trim()) return;
    setSending(true);
    setStatus(null);
    try {
      const res = await fetch(`${API_URL}/api/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret, text }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ type: 'success', msg: `Відправлено ${data.sent} з ${data.total} підписників` });
        setText('');
      } else {
        setStatus({ type: 'error', msg: data.error || 'Помилка' });
      }
    } catch {
      setStatus({ type: 'error', msg: 'Помилка з\'єднання' });
    } finally {
      setSending(false);
    }
  }

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ width: '100%', maxWidth: 340 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <Lock size={20} color="var(--primary)" />
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>Адмін-панель</h2>
          </div>
          <input
            type="password"
            placeholder="Пароль"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && login()}
            style={{
              width: '100%', padding: '12px 14px', borderRadius: 12,
              border: '1px solid var(--border-light)', background: 'var(--card-bg)',
              color: 'var(--text-primary)', fontSize: 15, marginBottom: 12,
              boxSizing: 'border-box',
            }}
          />
          {status && (
            <p style={{ color: 'var(--error, #ef4444)', fontSize: 13, marginBottom: 10 }}>{status.msg}</p>
          )}
          <button
            className="btn btn--primary"
            style={{ width: '100%' }}
            onClick={login}
          >
            Увійти
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: 20 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Розсилка</h2>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, color: 'var(--text-secondary)', fontSize: 13 }}>
        <Users size={14} />
        <span>{subscriberCount !== null ? `${subscriberCount} підписників` : '…'}</span>
      </div>

      <textarea
        placeholder="Текст повідомлення…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        style={{
          width: '100%', padding: '12px 14px', borderRadius: 12,
          border: '1px solid var(--border-light)', background: 'var(--card-bg)',
          color: 'var(--text-primary)', fontSize: 14, lineHeight: 1.5,
          resize: 'vertical', marginBottom: 12, boxSizing: 'border-box',
        }}
      />

      {status && (
        <p style={{
          color: status.type === 'success' ? 'var(--success, #22c55e)' : 'var(--error, #ef4444)',
          fontSize: 13, marginBottom: 10,
        }}>
          {status.msg}
        </p>
      )}

      <button
        className="btn btn--primary"
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        onClick={sendNotification}
        disabled={sending || !text.trim()}
      >
        <Send size={15} />
        {sending ? 'Відправляємо…' : 'Відправити всім'}
      </button>
    </div>
  );
}
