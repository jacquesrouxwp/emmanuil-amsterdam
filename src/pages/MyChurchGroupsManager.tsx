import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Plus, Edit2, Trash2, X, Loader2, MapPin, Clock, User, Phone, Image } from 'lucide-react';
import { hapticFeedback } from '@/lib/telegram';
import { useUserStore } from '@/store/userStore';
import { fetchApiHomeGroups, createHomeGroup, updateHomeGroup, deleteHomeGroup } from '@/lib/api';

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

const DAYS: Record<Lang, string[]> = {
  ua: ['Понеділок','Вівторок','Середа','Четвер','\u041F\u2019\u044F\u0442\u043D\u0438\u0446\u044F','Субота','Неділя'],
  ru: ['Понедельник','Вторник','Среда','Четверг','Пятница','Суббота','Воскресенье'],
  en: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
};

function emptyGroup(churchId: string) {
  return {
    churchId,
    city: '', address: '', time: '19:00', photo: '', leader: '', phone: '',
    day: { ua: 'Середа', ru: 'Среда', en: 'Wednesday' },
    description: { ua: '', ru: '', en: '' },
  };
}

function GroupCard({ group, onEdit, onDelete }: { group: any; onEdit: () => void; onDelete: () => void }) {
  const [confirming, setConfirming] = useState(false);
  const desc = group.description?.ua || group.description?.ru || '';

  return (
    <div style={{ padding: '14px 16px', borderRadius: 16, background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      {/* Фото або заглушка */}
      <div style={{ width: 52, height: 52, borderRadius: 12, flexShrink: 0, overflow: 'hidden', background: 'rgba(52,199,89,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {group.photo
          ? <img src={group.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          : <span style={{ fontSize: 22 }}>🏠</span>}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
          {group.leader || 'Лідер не вказаний'}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {group.day?.ua && <span style={{ fontSize: 11, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 3 }}><Clock size={10} /> {group.day.ua} {group.time}</span>}
          {group.address && <span style={{ fontSize: 11, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 3 }}><MapPin size={10} /> {group.address}</span>}
        </div>
        {desc && <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4, lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{desc}</p>}
      </div>

      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
        <button onClick={onEdit} style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(52,199,89,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <Edit2 size={13} color="#34C759" />
        </button>
        {confirming ? (
          <div style={{ display: 'flex', gap: 4 }}>
            <button onClick={() => { hapticFeedback('medium'); onDelete(); }} style={{ padding: '4px 8px', borderRadius: 8, background: 'rgba(255,59,48,0.15)', color: '#FF3B30', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Так</button>
            <button onClick={() => setConfirming(false)} style={{ padding: '4px 8px', borderRadius: 8, background: 'var(--bg)', color: 'var(--text-tertiary)', fontSize: 11, cursor: 'pointer' }}>Ні</button>
          </div>
        ) : (
          <button onClick={() => setConfirming(true)} style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(255,59,48,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Trash2 size={13} color="#FF3B30" />
          </button>
        )}
      </div>
    </div>
  );
}

function GroupEditor({ group, onSave, onCancel, saving }: { group: any; onSave: (g: any) => void; onCancel: () => void; saving: boolean }) {
  const [draft, setDraft] = useState(group);
  const [lang, setLang] = useState<Lang>('ua');
  const canSave = !!(draft.leader?.trim() || draft.address?.trim());

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <button onClick={onCancel} style={{ cursor: 'pointer' }}><X size={18} color="var(--text-tertiary)" /></button>
        <p style={{ fontSize: 15, fontWeight: 700 }}>{draft._id ? 'Редагувати групу' : 'Нова домашня група'}</p>
        <button onClick={() => onSave(draft)} disabled={saving || !canSave}
          style={{ padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: canSave ? 'pointer' : 'default', background: canSave ? '#34C759' : 'var(--bg-secondary)', color: canSave ? '#fff' : 'var(--text-tertiary)' }}>
          {saving ? '...' : 'Зберегти'}
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 14, paddingBottom: 48 }}>

        <div style={{ display: 'flex', gap: 8 }}>
          {LANGS.map((l) => (
            <button key={l} onClick={() => setLang(l)}
              style={{ flex: 1, padding: '8px', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer', background: lang === l ? '#34C759' : 'var(--bg-secondary)', color: lang === l ? '#fff' : 'var(--text-tertiary)', border: `1px solid ${lang === l ? '#34C759' : 'var(--border-light)'}` }}>
              {LANG_LABEL[l]}
            </button>
          ))}
        </div>

        {/* День тижня */}
        <div>
          <label style={LABEL}>День тижня ({lang.toUpperCase()})</label>
          <select value={draft.day?.[lang] || ''} onChange={(e) => setDraft({ ...draft, day: { ...draft.day, [lang]: e.target.value } })}
            style={{ ...INPUT, cursor: 'pointer' }}>
            {DAYS[lang].map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <div>
          <label style={LABEL}>Опис ({lang.toUpperCase()})</label>
          <textarea value={draft.description?.[lang] || ''} onChange={(e) => setDraft({ ...draft, description: { ...draft.description, [lang]: e.target.value } })}
            placeholder="Чим займається ця група, хто приходить..." rows={3}
            style={{ ...INPUT, resize: 'none' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div><label style={{ ...LABEL, display: 'flex', alignItems: 'center', gap: 4 }}><User size={11} /> Лідер</label>
            <input value={draft.leader || ''} onChange={(e) => setDraft({ ...draft, leader: e.target.value })} placeholder="Ім'я лідера" style={INPUT} /></div>
          <div><label style={{ ...LABEL, display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={11} /> Час</label>
            <input value={draft.time || ''} onChange={(e) => setDraft({ ...draft, time: e.target.value })} placeholder="19:00" style={INPUT} /></div>
        </div>

        <div><label style={{ ...LABEL, display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={11} /> Адреса</label>
          <input value={draft.address || ''} onChange={(e) => setDraft({ ...draft, address: e.target.value })} placeholder="вул. Сонячна 5, кв. 12" style={INPUT} /></div>

        <div><label style={{ ...LABEL, display: 'flex', alignItems: 'center', gap: 4 }}><Phone size={11} /> Телефон лідера</label>
          <input value={draft.phone || ''} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} placeholder="+380 99 123 4567" style={INPUT} /></div>

        <div><label style={{ ...LABEL, display: 'flex', alignItems: 'center', gap: 4 }}><Image size={11} /> Фото лідера (URL)</label>
          <input value={draft.photo || ''} onChange={(e) => setDraft({ ...draft, photo: e.target.value })} placeholder="https://..." style={INPUT} /></div>
      </div>
    </div>
  );
}

export function MyChurchGroupsManager() {
  const navigate = useNavigate();
  const { churchId } = useUserStore();
  const secret = localStorage.getItem('emmanuil_admin_secret') || '';
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchApiHomeGroups().then((all) => {
      setGroups(all.filter((g: any) => !g.churchId || g.churchId === churchId));
    }).finally(() => setLoading(false));
  }, [churchId]);

  async function handleSave(draft: any) {
    setSaving(true); hapticFeedback('medium');
    try {
      const payload = { ...draft, churchId };
      if (draft._id) {
        const u = await updateHomeGroup(secret, draft._id, payload);
        setGroups((g) => g.map((x) => x._id === draft._id ? u : x));
      } else {
        const c = await createHomeGroup(secret, payload);
        setGroups((g) => [c, ...g]);
      }
      setEditing(null);
    } catch (e: any) { alert('Помилка: ' + (e?.message || 'unknown')); }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    hapticFeedback('medium');
    try { await deleteHomeGroup(secret, id); setGroups((g) => g.filter((x) => x._id !== id)); }
    catch (e: any) { alert('Помилка: ' + (e?.message || 'unknown')); }
  }

  return (
    <>
      <div style={{ minHeight: '100%', overflowY: 'auto', background: 'var(--bg)', paddingBottom: 90 }}>
        <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--bg)', borderBottom: '1px solid var(--border-light)', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => navigate('/my-church')} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}>
            <ChevronLeft size={18} /> Назад
          </button>
          <p style={{ fontSize: 15, fontWeight: 700 }}>Домашні групи</p>
          <button onClick={() => { hapticFeedback('light'); setEditing(emptyGroup(churchId || '')); }}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, fontSize: 13, fontWeight: 700, background: '#34C759', color: '#fff', cursor: 'pointer' }}>
            <Plus size={14} /> Нова
          </button>
        </div>

        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {loading && <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 0' }}><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><Loader2 size={28} color="#34C759" /></motion.div></div>}

          {!loading && groups.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: 36 }}>🏠</span>
              <div>
                <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Ще немає домашніх груп</p>
                <p style={{ fontSize: 13, color: 'var(--text-tertiary)', lineHeight: 1.5 }}>Малі групи — серце церкви. Додайте першу!</p>
              </div>
              <button onClick={() => setEditing(emptyGroup(churchId || ''))}
                style={{ padding: '12px 24px', borderRadius: 12, fontSize: 14, fontWeight: 700, background: '#34C759', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Plus size={16} /> Додати групу
              </button>
            </div>
          )}

          <AnimatePresence>
            {groups.map((g) => (
              <motion.div key={g._id || g.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
                <GroupCard group={g} onEdit={() => setEditing({ ...g })} onDelete={() => handleDelete(g._id)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {editing && <GroupEditor group={editing} onSave={handleSave} onCancel={() => setEditing(null)} saving={saving} />}
      </AnimatePresence>
    </>
  );
}
