import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Plus, Edit2, Trash2, X, Loader2, Calendar, Clock, MapPin, Image, ExternalLink } from 'lucide-react';
import { hapticFeedback } from '@/lib/telegram';
import { useUserStore } from '@/store/userStore';
import { fetchApiEvents, createEvent, updateEvent, deleteEvent } from '@/lib/api';

const INPUT: React.CSSProperties = {
  width: '100%', padding: '11px 13px', borderRadius: 11, fontSize: 14,
  border: '1px solid var(--border-light)', background: 'var(--bg)',
  color: 'var(--text-primary)',
};
const LABEL: React.CSSProperties = {
  fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)',
  display: 'block', marginBottom: 5, letterSpacing: 0.7, textTransform: 'uppercase',
};

const LANGS = ['ua', 'ru', 'en'] as const;
type Lang = typeof LANGS[number];
const LANG_LABEL: Record<Lang, string> = { ua: '🇺🇦 UA', ru: '🇷🇺 RU', en: '🇬🇧 EN' };

const COLORS = ['#5E9ED6', '#FF9F0A', '#34C759', '#C9A96E', '#AF52DE', '#FF3B30'];

function emptyEvent(churchId: string) {
  return {
    churchId,
    color: '#5E9ED6',
    sortDate: new Date().toISOString().slice(0, 10),
    title: { ua: '', ru: '', en: '' },
    date: { ua: '', ru: '', en: '' },
    time: '',
    address: '',
    badge: { ua: '', ru: '', en: '' },
    shortDesc: { ua: '', ru: '', en: '' },
    fullDesc: { ua: '', ru: '', en: '' },
    photo: '',
    link: '',
  };
}

function EventCard({ event, onEdit, onDelete }: { event: any; onEdit: () => void; onDelete: () => void }) {
  const title = event.title?.ua || event.title?.ru || event.title?.en || '(без назви)';
  const [confirming, setConfirming] = useState(false);

  return (
    <div style={{
      padding: '14px 16px', borderRadius: 16,
      background: 'var(--bg-secondary)', border: '1px solid var(--border-light)',
      display: 'flex', gap: 14, alignItems: 'flex-start',
    }}>
      {/* Кольоровий індикатор */}
      <div style={{ width: 4, borderRadius: 4, alignSelf: 'stretch', background: event.color || '#5E9ED6', flexShrink: 0 }} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{title}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {event.sortDate && (
            <span style={{ fontSize: 11, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 3 }}>
              <Calendar size={10} /> {event.sortDate}
            </span>
          )}
          {event.time && (
            <span style={{ fontSize: 11, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 3 }}>
              <Clock size={10} /> {event.time}
            </span>
          )}
          {event.address && (
            <span style={{ fontSize: 11, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 3 }}>
              <MapPin size={10} /> {event.address}
            </span>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
        <button onClick={onEdit}
          style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(94,158,214,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <Edit2 size={13} color="var(--primary)" />
        </button>
        {confirming ? (
          <div style={{ display: 'flex', gap: 4 }}>
            <button onClick={() => { hapticFeedback('medium'); onDelete(); }}
              style={{ padding: '4px 8px', borderRadius: 8, background: 'rgba(255,59,48,0.15)', color: '#FF3B30', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Так</button>
            <button onClick={() => setConfirming(false)}
              style={{ padding: '4px 8px', borderRadius: 8, background: 'var(--bg)', color: 'var(--text-tertiary)', fontSize: 11, cursor: 'pointer' }}>Ні</button>
          </div>
        ) : (
          <button onClick={() => setConfirming(true)}
            style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(255,59,48,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Trash2 size={13} color="#FF3B30" />
          </button>
        )}
      </div>
    </div>
  );
}

function EventEditor({ event, onSave, onCancel, saving }: { event: any; onSave: (e: any) => void; onCancel: () => void; saving: boolean }) {
  const [draft, setDraft] = useState(event);
  const [lang, setLang] = useState<Lang>('ua');
  const canSave = !!(draft.title.ua?.trim() || draft.title.ru?.trim() || draft.title.en?.trim());

  const setML = (field: string, val: string) => setDraft({ ...draft, [field]: { ...draft[field], [lang]: val } });

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <button onClick={onCancel} style={{ cursor: 'pointer' }}><X size={18} color="var(--text-tertiary)" /></button>
        <p style={{ fontSize: 15, fontWeight: 700 }}>{draft._id ? 'Редагувати подію' : 'Нова подія'}</p>
        <button onClick={() => onSave(draft)} disabled={saving || !canSave}
          style={{ padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: canSave ? 'pointer' : 'default', background: canSave ? 'var(--primary)' : 'var(--bg-secondary)', color: canSave ? '#fff' : 'var(--text-tertiary)' }}>
          {saving ? '...' : 'Зберегти'}
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 48 }}>

        {/* Колір */}
        <div>
          <label style={LABEL}>Колір події</label>
          <div style={{ display: 'flex', gap: 10 }}>
            {COLORS.map((c) => (
              <button key={c} onClick={() => setDraft({ ...draft, color: c })}
                style={{ width: 32, height: 32, borderRadius: '50%', background: c, cursor: 'pointer', border: draft.color === c ? '3px solid var(--text-primary)' : '3px solid transparent' }} />
            ))}
          </div>
        </div>

        {/* Мова */}
        <div style={{ display: 'flex', gap: 8 }}>
          {LANGS.map((l) => (
            <button key={l} onClick={() => setLang(l)}
              style={{ flex: 1, padding: '8px', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer', background: lang === l ? 'var(--primary)' : 'var(--bg-secondary)', color: lang === l ? '#fff' : 'var(--text-tertiary)', border: `1px solid ${lang === l ? 'var(--primary)' : 'var(--border-light)'}` }}>
              {LANG_LABEL[l]}
            </button>
          ))}
        </div>

        <div><label style={LABEL}>Назва події ({lang.toUpperCase()})</label>
          <input value={draft.title[lang] || ''} onChange={(e) => setML('title', e.target.value)} placeholder="Конференція, концерт, молодіжний вечір..." style={INPUT} /></div>

        <div><label style={LABEL}>Дата (текст, {lang.toUpperCase()})</label>
          <input value={draft.date[lang] || ''} onChange={(e) => setML('date', e.target.value)} placeholder="12 травня / 12 мая / May 12" style={INPUT} /></div>

        <div><label style={LABEL}>Короткий опис ({lang.toUpperCase()})</label>
          <textarea value={draft.shortDesc[lang] || ''} onChange={(e) => setML('shortDesc', e.target.value)} placeholder="Два речення для прев'ю..." rows={2} style={{ ...INPUT, resize: 'none' }} /></div>

        <div><label style={LABEL}>Повний опис ({lang.toUpperCase()})</label>
          <textarea value={draft.fullDesc[lang] || ''} onChange={(e) => setML('fullDesc', e.target.value)} placeholder="Детальний опис події..." rows={4} style={{ ...INPUT, resize: 'none' }} /></div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div><label style={{ ...LABEL, display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={11} /> Дата (сортування)</label>
            <input type="date" value={draft.sortDate || ''} onChange={(e) => setDraft({ ...draft, sortDate: e.target.value })} style={INPUT} /></div>
          <div><label style={{ ...LABEL, display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={11} /> Час</label>
            <input value={draft.time || ''} onChange={(e) => setDraft({ ...draft, time: e.target.value })} placeholder="18:00" style={INPUT} /></div>
        </div>

        <div><label style={{ ...LABEL, display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={11} /> Адреса</label>
          <input value={draft.address || ''} onChange={(e) => setDraft({ ...draft, address: e.target.value })} placeholder="вул. Хрещатик 1" style={INPUT} /></div>

        <div><label style={{ ...LABEL, display: 'flex', alignItems: 'center', gap: 4 }}><Image size={11} /> Фото (URL)</label>
          <input value={draft.photo || ''} onChange={(e) => setDraft({ ...draft, photo: e.target.value })} placeholder="https://..." style={INPUT} /></div>

        <div><label style={{ ...LABEL, display: 'flex', alignItems: 'center', gap: 4 }}><ExternalLink size={11} /> Посилання (реєстрація тощо)</label>
          <input value={draft.link || ''} onChange={(e) => setDraft({ ...draft, link: e.target.value })} placeholder="https://..." style={INPUT} /></div>
      </div>
    </div>
  );
}

export function MyChurchEventsManager() {
  const navigate = useNavigate();
  const { churchId } = useUserStore();
  const secret = localStorage.getItem('emmanuil_admin_secret') || '';

  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchApiEvents().then((all) => {
      setEvents(all.filter((e: any) => !e.churchId || e.churchId === churchId));
    }).finally(() => setLoading(false));
  }, [churchId]);

  async function handleSave(draft: any) {
    setSaving(true); hapticFeedback('medium');
    try {
      const payload = { ...draft, churchId };
      if (draft._id) {
        const u = await updateEvent(secret, draft._id, payload);
        setEvents((e) => e.map((x) => x._id === draft._id ? u : x));
      } else {
        const c = await createEvent(secret, payload);
        setEvents((e) => [c, ...e]);
      }
      setEditing(null);
    } catch (e: any) { alert('Помилка: ' + (e?.message || 'unknown')); }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    hapticFeedback('medium');
    try { await deleteEvent(secret, id); setEvents((e) => e.filter((x) => x._id !== id)); }
    catch (e: any) { alert('Помилка: ' + (e?.message || 'unknown')); }
  }

  return (
    <>
      <div style={{ minHeight: '100%', overflowY: 'auto', background: 'var(--bg)', paddingBottom: 90 }}>
        <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--bg)', borderBottom: '1px solid var(--border-light)', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => navigate('/my-church')} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}>
            <ChevronLeft size={18} /> Назад
          </button>
          <p style={{ fontSize: 15, fontWeight: 700 }}>Події</p>
          <button onClick={() => { hapticFeedback('light'); setEditing(emptyEvent(churchId || '')); }}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, fontSize: 13, fontWeight: 700, background: 'var(--primary)', color: '#fff', cursor: 'pointer' }}>
            <Plus size={14} /> Нова
          </button>
        </div>

        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {loading && <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 0' }}><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><Loader2 size={28} color="var(--primary)" /></motion.div></div>}

          {!loading && events.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: 36 }}>📅</span>
              <div>
                <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Ще немає подій</p>
                <p style={{ fontSize: 13, color: 'var(--text-tertiary)', lineHeight: 1.5 }}>Додайте конференцію, концерт або молодіжний вечір</p>
              </div>
              <button onClick={() => setEditing(emptyEvent(churchId || ''))}
                style={{ padding: '12px 24px', borderRadius: 12, fontSize: 14, fontWeight: 700, background: 'var(--primary)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Plus size={16} /> Додати подію
              </button>
            </div>
          )}

          <AnimatePresence>
            {events.map((ev) => (
              <motion.div key={ev._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
                <EventCard event={ev} onEdit={() => setEditing({ ...ev })} onDelete={() => handleDelete(ev._id)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {editing && <EventEditor event={editing} onSave={handleSave} onCancel={() => setEditing(null)} saving={saving} />}
      </AnimatePresence>
    </>
  );
}
