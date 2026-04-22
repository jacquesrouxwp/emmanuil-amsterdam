import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, Plus, Copy, Check, Send,
  Clock, CheckCircle2, XCircle, Loader2, Users,
} from 'lucide-react';
import { hapticFeedback } from '@/lib/telegram';
import { createInvitation, listMyInvitations, type Invitation } from '@/lib/api';

function useCopy() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    });
  };
  return { copiedKey, copy };
}

function inviteStatus(inv: Invitation): { label: string; color: string; icon: React.ReactNode } {
  if (inv.usedAt) return { label: 'Використано', color: '#34C759', icon: <CheckCircle2 size={13} color="#34C759" /> };
  if (new Date(inv.expiresAt) < new Date()) return { label: 'Прострочено', color: '#FF3B30', icon: <XCircle size={13} color="#FF3B30" /> };
  return { label: 'Очікує', color: '#FF9F0A', icon: <Clock size={13} color="#FF9F0A" /> };
}

function makeInviteUrl(token: string) {
  const base = window.location.origin + (import.meta.env.BASE_URL || '/');
  return `${base}invite/${token}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ── Картка запрошення ──────────────────────────────────────────────────────
function InviteCard({ inv, copiedKey, onCopy }: {
  inv: Invitation;
  copiedKey: string | null;
  onCopy: (text: string, key: string) => void;
}) {
  const status = inviteStatus(inv);
  const url = makeInviteUrl(inv.token);
  const isActive = !inv.usedAt && new Date(inv.expiresAt) > new Date();

  return (
    <motion.div layout
      style={{
        padding: '14px 16px', borderRadius: 16,
        background: 'var(--bg-secondary)', border: '1px solid var(--border-light)',
        display: 'flex', flexDirection: 'column', gap: 10,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {status.icon}
          <span style={{ fontSize: 12, fontWeight: 700, color: status.color }}>{status.label}</span>
        </div>
        <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
          {inv.usedAt ? `Використано ${formatDate(inv.usedAt)}` : `До ${formatDate(inv.expiresAt)}`}
        </span>
      </div>

      {inv.note && (
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', fontStyle: 'italic' }}>
          «{inv.note}»
        </p>
      )}

      {/* Посилання */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '9px 12px', borderRadius: 10,
        background: 'var(--bg)', border: '1px solid var(--border-light)',
      }}>
        <p style={{ flex: 1, fontSize: 11, fontFamily: 'monospace', color: 'var(--text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {url}
        </p>
        {isActive && (
          <>
            <button onClick={() => { hapticFeedback('light'); onCopy(url, inv.token); }}
              style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer', background: copiedKey === inv.token ? 'rgba(52,199,89,0.12)' : 'rgba(94,158,214,0.1)', color: copiedKey === inv.token ? '#34C759' : 'var(--primary)', transition: 'all 0.2s' }}>
              {copiedKey === inv.token ? <><Check size={11} /> OK</> : <><Copy size={11} /> Копіювати</>}
            </button>
            <button onClick={() => {
              hapticFeedback('light');
              const text = encodeURIComponent(`Привіт! Запрошую тебе приєднатися до мережі Kairos як пастора.\n\n${url}`);
              window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${text}`, '_blank');
            }}
              style={{ flexShrink: 0, width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'rgba(33,158,217,0.1)' }}>
              <Send size={13} color="#229ED9" />
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}

// ── Головна сторінка ───────────────────────────────────────────────────────
export function MyChurchInvitePastorPage() {
  const navigate = useNavigate();
  const secret = localStorage.getItem('emmanuil_admin_secret') || '';

  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [note, setNote] = useState('');
  const [showForm, setShowForm] = useState(false);
  const { copiedKey, copy } = useCopy();

  useEffect(() => {
    listMyInvitations(secret).then(setInvitations).finally(() => setLoading(false));
  }, [secret]);

  async function handleCreate() {
    if (!secret) return;
    setCreating(true);
    hapticFeedback('medium');
    try {
      await createInvitation(secret, note.trim() || undefined);
      const updated = await listMyInvitations(secret);
      setInvitations(updated);
      setNote('');
      setShowForm(false);
    } catch (e: any) {
      alert('Помилка: ' + (e?.message || 'невідома'));
    } finally {
      setCreating(false);
    }
  }

  const active = invitations.filter((i) => !i.usedAt && new Date(i.expiresAt) > new Date());
  const used = invitations.filter((i) => i.usedAt);
  const expired = invitations.filter((i) => !i.usedAt && new Date(i.expiresAt) <= new Date());

  return (
    <div style={{ minHeight: '100%', overflowY: 'auto', background: 'var(--bg)', paddingBottom: 90 }}>

      {/* Header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--bg)', borderBottom: '1px solid var(--border-light)', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => navigate('/my-church')} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}>
          <ChevronLeft size={18} /> Назад
        </button>
        <p style={{ fontSize: 15, fontWeight: 700 }}>Запросити пастора</p>
        <button onClick={() => { hapticFeedback('light'); setShowForm((v) => !v); }}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, fontSize: 13, fontWeight: 700, background: showForm ? 'var(--bg-secondary)' : 'var(--primary)', color: showForm ? 'var(--text-tertiary)' : '#fff', cursor: 'pointer' }}>
          <Plus size={14} /> Нове
        </button>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Форма створення */}
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0, y: -10, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -10, height: 0 }}
              style={{ overflow: 'hidden' }}>
              <div style={{ padding: '16px', borderRadius: 18, background: 'var(--bg-secondary)', border: '1px solid rgba(94,158,214,0.2)', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Нове запрошення</p>
                <input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Нотатка (необов'язково): для кого це запрошення"
                  style={{ width: '100%', padding: '11px 13px', borderRadius: 11, fontSize: 14, border: '1px solid var(--border-light)', background: 'var(--bg)', color: 'var(--text-primary)' }}
                />
                <button onClick={handleCreate} disabled={creating}
                  style={{ padding: '12px', borderRadius: 12, fontSize: 14, fontWeight: 700, background: 'var(--primary)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  {creating ? <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><Loader2 size={16} /></motion.div> Створюємо...</> : 'Створити посилання'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Філософія (тільки якщо немає жодного запрошення) */}
        {!loading && invitations.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            style={{ padding: '20px', borderRadius: 18, background: 'linear-gradient(135deg, #0d1f33, #1a3a5c)', border: '1px solid rgba(94,158,214,0.2)', display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center', textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(94,158,214,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={26} color="var(--primary)" />
            </div>
            <div>
              <p style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Запрошення — це довіра</p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65 }}>
                Кожен пастор у Kairos з'явився через особисте знайомство. Ваше запрошення — це ваше слово. Запрошуйте тих, кого знаєте і кому довіряєте.
              </p>
            </div>
            <button onClick={() => { hapticFeedback('light'); setShowForm(true); }}
              style={{ padding: '12px 28px', borderRadius: 12, fontSize: 14, fontWeight: 700, background: 'var(--primary)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Plus size={16} /> Створити перше запрошення
            </button>
          </motion.div>
        )}

        {/* Завантаження */}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 0' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
              <Loader2 size={28} color="var(--primary)" />
            </motion.div>
          </div>
        )}

        {/* Активні */}
        {active.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.8, color: '#FF9F0A', textTransform: 'uppercase', paddingLeft: 4 }}>
              Активні · {active.length}
            </p>
            <AnimatePresence>
              {active.map((inv) => <InviteCard key={inv._id} inv={inv} copiedKey={copiedKey} onCopy={copy} />)}
            </AnimatePresence>
          </div>
        )}

        {/* Використані */}
        {used.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.8, color: '#34C759', textTransform: 'uppercase', paddingLeft: 4 }}>
              Використані · {used.length}
            </p>
            <AnimatePresence>
              {used.map((inv) => <InviteCard key={inv._id} inv={inv} copiedKey={copiedKey} onCopy={copy} />)}
            </AnimatePresence>
          </div>
        )}

        {/* Прострочені */}
        {expired.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.8, color: 'var(--text-tertiary)', textTransform: 'uppercase', paddingLeft: 4 }}>
              Прострочені · {expired.length}
            </p>
            <AnimatePresence>
              {expired.map((inv) => <InviteCard key={inv._id} inv={inv} copiedKey={copiedKey} onCopy={copy} />)}
            </AnimatePresence>
          </div>
        )}

      </div>
    </div>
  );
}
