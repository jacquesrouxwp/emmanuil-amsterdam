import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Edit2, Trash2, X, Image, LogOut, FileText, Calendar, Home, BarChart2, Video } from 'lucide-react';
import { hapticFeedback } from '@/lib/telegram';
import {
  fetchPosts, createPost, updatePost, deletePost,
  fetchApiEvents, createEvent, updateEvent, deleteEvent,
  fetchStats, updateStats,
  fetchApiHomeGroups, createHomeGroup, updateHomeGroup, deleteHomeGroup,
  type ApiPost,
} from '@/lib/api';
import { blogPosts } from '@/data/blog';
import { homeGroups as staticGroups } from '@/data/schedule';

export const ADMIN_SECRET_KEY = 'emmanuil_admin_secret';
export const ADMIN_MODE_KEY = 'emmanuil_admin_mode';

const LANGS = [
  { key: 'ru' as const, label: 'RU' }, { key: 'ua' as const, label: 'UA' },
  { key: 'en' as const, label: 'EN' }, { key: 'nl' as const, label: 'NL' },
  { key: 'es' as const, label: 'ES' },
];

type Lang = 'ru' | 'ua' | 'en' | 'nl' | 'es';
type Tab = 'posts' | 'events' | 'groups' | 'stats';

const TABS: { key: Tab; icon: typeof FileText; label: string }[] = [
  { key: 'posts', icon: FileText, label: 'Посты' },
  { key: 'events', icon: Calendar, label: 'События' },
  { key: 'groups', icon: Home, label: 'Группы' },
  { key: 'stats', icon: BarChart2, label: 'Статистика' },
];

const EMPTY_POST: Omit<ApiPost, '_id'> = {
  date: new Date().toISOString().slice(0, 10),
  tags: ['general'],
  photos: [],
  videos: [],
  title: { ua: '', ru: '', en: '', nl: '', es: '' },
  body: { ua: '', ru: '', en: '', nl: '', es: '' },
};

const EMPTY_EVENT = {
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

const EMPTY_GROUP = {
  city: '',
  address: '',
  time: '19:00',
  day: { ua: 'Середа', ru: 'Среда', en: 'Wednesday', nl: 'Woensdag', es: 'Miércoles' },
  leader: '',
  phone: '',
  photo: '',
  description: { ua: '', ru: '', en: '', nl: '', es: '' },
};

const INPUT = {
  width: '100%', padding: '9px 12px', borderRadius: 10, fontSize: 14,
  border: '1px solid var(--border-light)', background: 'var(--bg-secondary)',
  color: 'var(--text-primary)', boxSizing: 'border-box' as const,
};
const LABEL = { fontSize: 11, color: 'var(--text-tertiary)', display: 'block', marginBottom: 6 } as const;
const BTN_GOLD = {
  background: '#C9A96E', border: 'none', borderRadius: 10,
  padding: '8px 16px', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
export function AdminPage() {
  const navigate = useNavigate();
  const [secret, setSecret] = useState(() => localStorage.getItem(ADMIN_SECRET_KEY) || '');
  const [authed, setAuthed] = useState(() => !!localStorage.getItem(ADMIN_SECRET_KEY));
  const [authInput, setAuthInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<Tab>('posts');

  // Posts
  const [posts, setPosts] = useState<ApiPost[]>([]);
  const [editingPost, setEditingPost] = useState<(Omit<ApiPost, '_id'> & { _id?: string }) | null>(null);
  const [postLang, setPostLang] = useState<Lang>('ru');
  const [savingPost, setSavingPost] = useState(false);

  // Events
  const [events, setEvents] = useState<any[]>([]);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);
  const [eventLang, setEventLang] = useState<Lang>('ru');
  const [savingEvent, setSavingEvent] = useState(false);

  // Groups
  const [groups, setGroups] = useState<any[]>([]);
  const [editingGroup, setEditingGroup] = useState<any | null>(null);
  const [groupLang, setGroupLang] = useState<Lang>('ru');
  const [savingGroup, setSavingGroup] = useState(false);

  // Stats
  const [stats, setStats] = useState({ attendees: 402, youth: 43, children: 32, homeGroups: 7, ministries: 4 });
  const [savingStats, setSavingStats] = useState(false);
  const [statsSaved, setStatsSaved] = useState(false);

  useEffect(() => {
    if (authed) loadAll();
  }, [authed]);

  async function loadAll() {
    const [p, e, g, s] = await Promise.all([
      fetchPosts(), fetchApiEvents(), fetchApiHomeGroups(), fetchStats(),
    ]);
    setPosts(p);
    setEvents(e);
    setGroups(g.length ? g : staticGroups.map(g => ({ ...g, _id: g.id })));
    if (s && Object.keys(s).length > 1) setStats(s as any);
  }

  async function tryAuth(s: string) {
    setLoading(true);
    try {
      const res = await fetch('/api/posts', { headers: { 'x-admin-secret': s } });
      if (res.ok) {
        localStorage.setItem(ADMIN_SECRET_KEY, s);
        localStorage.setItem(ADMIN_MODE_KEY, 'true');
        setSecret(s); setAuthed(true);
      } else { setAuthError('Неверный пароль'); }
    } catch { setAuthError('Ошибка подключения'); }
    setLoading(false);
  }

  function logout() {
    localStorage.removeItem(ADMIN_SECRET_KEY);
    localStorage.removeItem(ADMIN_MODE_KEY);
    setAuthed(false); setSecret('');
    // Replace so back button won't land back on admin; full navigation forces remount
    navigate('/more', { replace: true });
  }

  // ── Auth screen ──────────────────────────────────────────
  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'var(--bg-primary)' }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>🔐</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Emmanuil Admin</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 28 }}>Введите пароль</p>
        <input
          type="password" value={authInput}
          onChange={e => { setAuthInput(e.target.value); setAuthError(''); }}
          onKeyDown={e => e.key === 'Enter' && tryAuth(authInput)}
          placeholder="Пароль" autoFocus
          style={{ ...INPUT, maxWidth: 300, fontSize: 16, marginBottom: 10 }}
        />
        {authError && <p style={{ color: '#ff3b5c', fontSize: 13, marginBottom: 10 }}>{authError}</p>}
        <button onClick={() => tryAuth(authInput)} disabled={loading || !authInput}
          style={{ ...BTN_GOLD, width: '100%', maxWidth: 300, padding: 14, fontSize: 16, opacity: loading || !authInput ? 0.5 : 1 }}>
          {loading ? 'Вход...' : 'Войти'}
        </button>
      </div>
    );
  }

  // ── Post editor ──────────────────────────────────────────
  if (editingPost) {
    const canSave = !!editingPost.title.ru?.trim() && !!editingPost.body.ru?.trim();
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid var(--border-light)', position: 'sticky', top: 0, background: 'var(--bg-primary)', zIndex: 10 }}>
          <button onClick={() => setEditingPost(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}><X size={22} color="var(--text-secondary)" /></button>
          <h2 style={{ fontSize: 17, fontWeight: 700 }}>{editingPost._id ? 'Редактировать пост' : 'Новый пост'}</h2>
          <button onClick={async () => {
            if (!editingPost) return; setSavingPost(true); hapticFeedback('medium');
            try {
              if (editingPost._id) {
                const u = await updatePost(secret, editingPost._id, editingPost);
                setPosts(p => p.map(x => x._id === editingPost._id ? u : x));
              } else {
                const c = await createPost(secret, editingPost);
                setPosts(p => [c, ...p]);
              }
              setEditingPost(null);
            } catch {}
            setSavingPost(false);
          }} disabled={savingPost || !canSave} style={{ ...BTN_GOLD, opacity: canSave ? 1 : 0.4 }}>
            {savingPost ? '...' : 'Сохранить'}
          </button>
        </div>
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Date */}
          <div><label style={LABEL}>ДАТА</label>
            <input type="date" value={editingPost.date} onChange={e => setEditingPost({ ...editingPost, date: e.target.value })} style={INPUT} />
          </div>
          {/* Tags */}
          <div><label style={LABEL}>ТЕГ</label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {(['general', 'youth', 'recordings'] as const).map(tag => (
                <button key={tag} onClick={() => setEditingPost({ ...editingPost, tags: [tag] })} style={{
                  padding: '7px 14px', borderRadius: 10, fontSize: 13, border: 'none', cursor: 'pointer',
                  background: editingPost.tags.includes(tag) ? '#C9A96E' : 'var(--bg-secondary)',
                  color: editingPost.tags.includes(tag) ? '#fff' : 'var(--text-secondary)', fontWeight: editingPost.tags.includes(tag) ? 700 : 400,
                }}>{{ general: 'Общее', youth: 'Молодёжь', recordings: 'Записи' }[tag]}</button>
              ))}
            </div>
          </div>
          {/* Photos */}
          <div><label style={LABEL}>ФОТО</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {editingPost.photos.map((url, i) => (
                <div key={i} style={{ position: 'relative', width: 72, height: 72 }}>
                  <img src={url} alt="" style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 10 }} />
                  <button onClick={() => setEditingPost({ ...editingPost, photos: editingPost.photos.filter((_, j) => j !== i) })}
                    style={{ position: 'absolute', top: -5, right: -5, width: 18, height: 18, borderRadius: '50%', background: '#ff3b5c', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <X size={10} color="#fff" />
                  </button>
                </div>
              ))}
              <button onClick={() => { const u = window.prompt('Ссылка на фото:'); if (u?.trim()) setEditingPost({ ...editingPost, photos: [...editingPost.photos, u.trim()] }); }}
                style={{ width: 72, height: 72, borderRadius: 10, border: '2px dashed var(--border-light)', background: 'var(--bg-secondary)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
                <Image size={18} color="var(--text-tertiary)" /><span style={{ fontSize: 9, color: 'var(--text-tertiary)' }}>Добавить</span>
              </button>
            </div>
          </div>
          {/* Videos */}
          <div><label style={LABEL}>ВИДЕО (YouTube)</label>
            {(editingPost.videos || []).map((url, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                <div style={{ flex: 1, padding: '8px 10px', borderRadius: 10, fontSize: 12, border: '1px solid var(--border-light)', background: 'var(--bg-secondary)', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  <Video size={11} style={{ marginRight: 5 }} />{url}
                </div>
                <button onClick={() => setEditingPost({ ...editingPost, videos: (editingPost.videos || []).filter((_, j) => j !== i) })}
                  style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,59,92,0.1)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={13} color="#ff3b5c" />
                </button>
              </div>
            ))}
            <button onClick={() => { const u = window.prompt('Ссылка YouTube:'); if (u?.trim()) setEditingPost({ ...editingPost, videos: [...(editingPost.videos || []), u.trim()] }); }}
              style={{ padding: '7px 12px', borderRadius: 10, border: '2px dashed var(--border-light)', background: 'var(--bg-secondary)', cursor: 'pointer', fontSize: 13, color: 'var(--text-secondary)' }}>
              + Добавить видео
            </button>
          </div>
          {/* Lang tabs */}
          <div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
              {LANGS.map(l => (
                <button key={l.key} onClick={() => setPostLang(l.key)} style={{
                  padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer',
                  background: postLang === l.key ? '#C9A96E' : 'var(--bg-secondary)',
                  color: postLang === l.key ? '#fff' : 'var(--text-secondary)',
                }}>{l.label}</button>
              ))}
            </div>
            <label style={LABEL}>ЗАГОЛОВОК {postLang === 'ru' && <span style={{ color: '#ff3b5c' }}>*</span>}</label>
            <input type="text" value={editingPost.title[postLang] || ''} onChange={e => setEditingPost({ ...editingPost, title: { ...editingPost.title, [postLang]: e.target.value } })}
              placeholder="Заголовок..." style={{ ...INPUT, fontWeight: 600, marginBottom: 10 }} />
            <label style={LABEL}>ТЕКСТ {postLang === 'ru' && <span style={{ color: '#ff3b5c' }}>*</span>}</label>
            <textarea value={editingPost.body[postLang] || ''} onChange={e => setEditingPost({ ...editingPost, body: { ...editingPost.body, [postLang]: e.target.value } })}
              placeholder="Текст поста..." rows={7}
              style={{ ...INPUT, resize: 'vertical', lineHeight: 1.55, fontFamily: 'inherit' }} />
          </div>
        </div>
      </div>
    );
  }

  // ── Event editor ─────────────────────────────────────────
  if (editingEvent) {
    const canSave = !!editingEvent.title?.ru?.trim() && !!editingEvent.address?.trim();
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid var(--border-light)', position: 'sticky', top: 0, background: 'var(--bg-primary)', zIndex: 10 }}>
          <button onClick={() => setEditingEvent(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}><X size={22} color="var(--text-secondary)" /></button>
          <h2 style={{ fontSize: 17, fontWeight: 700 }}>{editingEvent._id ? 'Редактировать событие' : 'Новое событие'}</h2>
          <button onClick={async () => {
            setSavingEvent(true); hapticFeedback('medium');
            try {
              if (editingEvent._id) {
                const u = await updateEvent(secret, editingEvent._id, editingEvent);
                setEvents(e => e.map(x => x._id === editingEvent._id ? u : x));
              } else {
                const c = await createEvent(secret, editingEvent);
                setEvents(e => [...e, c]);
              }
              setEditingEvent(null);
            } catch {}
            setSavingEvent(false);
          }} disabled={savingEvent || !canSave} style={{ ...BTN_GOLD, opacity: canSave ? 1 : 0.4 }}>
            {savingEvent ? '...' : 'Сохранить'}
          </button>
        </div>
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}><label style={LABEL}>ДАТА (для сортировки)</label>
              <input type="date" value={editingEvent.sortDate || ''} onChange={e => setEditingEvent({ ...editingEvent, sortDate: e.target.value })} style={INPUT} />
            </div>
            <div><label style={LABEL}>ВРЕМЯ</label>
              <input type="text" value={editingEvent.time || ''} onChange={e => setEditingEvent({ ...editingEvent, time: e.target.value })} placeholder="17:00" style={{ ...INPUT, width: 80 }} />
            </div>
          </div>
          <div><label style={LABEL}>АДРЕС</label>
            <input type="text" value={editingEvent.address || ''} onChange={e => setEditingEvent({ ...editingEvent, address: e.target.value })} placeholder="Javastraat 118, Amsterdam" style={INPUT} />
          </div>
          <div><label style={LABEL}>ЦВЕТ</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['#5E9ED6','#FF7F50','#4CAF82','#C9A96E','#AF52DE','#FF3B5C'].map(c => (
                <button key={c} onClick={() => setEditingEvent({ ...editingEvent, color: c })}
                  style={{ width: 28, height: 28, borderRadius: 8, background: c, border: editingEvent.color === c ? '3px solid white' : '2px solid transparent', cursor: 'pointer' }} />
              ))}
            </div>
          </div>
          <div><label style={LABEL}>ФОТО (URL)</label>
            <input type="text" value={editingEvent.photo || ''} onChange={e => setEditingEvent({ ...editingEvent, photo: e.target.value })} placeholder="https://..." style={INPUT} />
          </div>
          <div><label style={LABEL}>ССЫЛКА (URL)</label>
            <input type="text" value={editingEvent.link || ''} onChange={e => setEditingEvent({ ...editingEvent, link: e.target.value })} placeholder="https://..." style={INPUT} />
          </div>
          {/* Lang tabs for multilingual fields */}
          <div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
              {[{ key:'ru',label:'RU'},{key:'ua',label:'UA'},{key:'en',label:'EN'}].map(l => (
                <button key={l.key} onClick={() => setEventLang(l.key as Lang)} style={{
                  padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer',
                  background: eventLang === l.key ? '#C9A96E' : 'var(--bg-secondary)',
                  color: eventLang === l.key ? '#fff' : 'var(--text-secondary)',
                }}>{l.label}</button>
              ))}
            </div>
            <label style={LABEL}>НАЗВАНИЕ {eventLang==='ru'&&<span style={{color:'#ff3b5c'}}>*</span>}</label>
            <input type="text" value={editingEvent.title?.[eventLang]||''} onChange={e => setEditingEvent({...editingEvent, title:{...editingEvent.title,[eventLang]:e.target.value}})} placeholder="Название события..." style={{...INPUT,marginBottom:10,fontWeight:600}} />
            <label style={LABEL}>ДАТА (текст для отображения)</label>
            <input type="text" value={editingEvent.date?.[eventLang]||''} onChange={e => setEditingEvent({...editingEvent, date:{...editingEvent.date,[eventLang]:e.target.value}})} placeholder="19 апреля 2026" style={{...INPUT,marginBottom:10}} />
            <label style={LABEL}>БЕЙДЖ</label>
            <input type="text" value={editingEvent.badge?.[eventLang]||''} onChange={e => setEditingEvent({...editingEvent, badge:{...editingEvent.badge,[eventLang]:e.target.value}})} placeholder="Праздник" style={{...INPUT,marginBottom:10}} />
            <label style={LABEL}>КРАТКОЕ ОПИСАНИЕ</label>
            <textarea value={editingEvent.shortDesc?.[eventLang]||''} onChange={e => setEditingEvent({...editingEvent, shortDesc:{...editingEvent.shortDesc,[eventLang]:e.target.value}})} placeholder="Коротко..." rows={2} style={{...INPUT,resize:'vertical',fontFamily:'inherit',marginBottom:10}} />
            <label style={LABEL}>ПОЛНОЕ ОПИСАНИЕ</label>
            <textarea value={editingEvent.fullDesc?.[eventLang]||''} onChange={e => setEditingEvent({...editingEvent, fullDesc:{...editingEvent.fullDesc,[eventLang]:e.target.value}})} placeholder="Подробно..." rows={5} style={{...INPUT,resize:'vertical',fontFamily:'inherit'}} />
          </div>
        </div>
      </div>
    );
  }

  // ── Group editor ─────────────────────────────────────────
  if (editingGroup) {
    const canSave = !!editingGroup.city?.trim() && !!editingGroup.address?.trim();
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid var(--border-light)', position: 'sticky', top: 0, background: 'var(--bg-primary)', zIndex: 10 }}>
          <button onClick={() => setEditingGroup(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}><X size={22} color="var(--text-secondary)" /></button>
          <h2 style={{ fontSize: 17, fontWeight: 700 }}>{editingGroup._id ? 'Редактировать группу' : 'Новая группа'}</h2>
          <button onClick={async () => {
            setSavingGroup(true); hapticFeedback('medium');
            try {
              if (editingGroup._id) {
                const u = await updateHomeGroup(secret, editingGroup._id, editingGroup);
                setGroups(g => g.map(x => x._id === editingGroup._id ? u : x));
              } else {
                const c = await createHomeGroup(secret, editingGroup);
                setGroups(g => [...g, c]);
              }
              setEditingGroup(null);
            } catch {}
            setSavingGroup(false);
          }} disabled={savingGroup || !canSave} style={{ ...BTN_GOLD, opacity: canSave ? 1 : 0.4 }}>
            {savingGroup ? '...' : 'Сохранить'}
          </button>
        </div>
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div><label style={LABEL}>ГОРОД *</label>
            <input type="text" value={editingGroup.city||''} onChange={e=>setEditingGroup({...editingGroup,city:e.target.value})} placeholder="Amsterdam" style={INPUT} />
          </div>
          <div><label style={LABEL}>АДРЕС *</label>
            <input type="text" value={editingGroup.address||''} onChange={e=>setEditingGroup({...editingGroup,address:e.target.value})} placeholder="Улица, дом" style={INPUT} />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{flex:1}}><label style={LABEL}>ВРЕМЯ</label>
              <input type="text" value={editingGroup.time||''} onChange={e=>setEditingGroup({...editingGroup,time:e.target.value})} placeholder="19:00" style={INPUT} />
            </div>
            <div style={{flex:1}}><label style={LABEL}>ВЕДУЩИЙ</label>
              <input type="text" value={editingGroup.leader||''} onChange={e=>setEditingGroup({...editingGroup,leader:e.target.value})} placeholder="Имя" style={INPUT} />
            </div>
          </div>
          <div><label style={LABEL}>ТЕЛЕФОН</label>
            <input type="text" value={editingGroup.phone||''} onChange={e=>setEditingGroup({...editingGroup,phone:e.target.value})} placeholder="+31 6 ..." style={INPUT} />
          </div>
          <div><label style={LABEL}>ФОТО (URL)</label>
            <input type="text" value={editingGroup.photo||''} onChange={e=>setEditingGroup({...editingGroup,photo:e.target.value})} placeholder="https://i.ibb.co/..." style={INPUT} />
          </div>
          {/* Day localized */}
          <div>
            <label style={LABEL}>ДЕНЬ НЕДЕЛИ</label>
            <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
              {LANGS.map(l => (
                <button key={l.key} onClick={() => setGroupLang(l.key)} style={{
                  padding: '5px 10px', borderRadius: 8, fontSize: 11, border: 'none', cursor: 'pointer',
                  background: groupLang === l.key ? '#C9A96E' : 'var(--bg-secondary)',
                  color: groupLang === l.key ? '#fff' : 'var(--text-secondary)',
                }}>{l.label}</button>
              ))}
            </div>
            <input type="text" value={editingGroup.day?.[groupLang]||''} onChange={e=>setEditingGroup({...editingGroup,day:{...editingGroup.day,[groupLang]:e.target.value}})} placeholder="Среда" style={{...INPUT,marginBottom:10}} />
            <label style={LABEL}>ОПИСАНИЕ</label>
            <textarea value={editingGroup.description?.[groupLang]||''} onChange={e=>setEditingGroup({...editingGroup,description:{...editingGroup.description,[groupLang]:e.target.value}})} placeholder="Описание группы..." rows={4} style={{...INPUT,resize:'vertical',fontFamily:'inherit'}} />
          </div>
        </div>
      </div>
    );
  }

  // ── Main panel ───────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid var(--border-light)', position: 'sticky', top: 0, background: 'var(--bg-primary)', zIndex: 10 }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <ArrowLeft size={22} color="var(--text-secondary)" />
        </button>
        <h2 style={{ fontSize: 17, fontWeight: 700 }}>⚙️ Админ панель</h2>
        <button onClick={logout} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <LogOut size={20} color="#ff3b5c" />
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)', background: 'var(--bg-primary)', position: 'sticky', top: 51, zIndex: 9 }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            flex: 1, padding: '10px 4px', border: 'none', cursor: 'pointer', background: 'transparent',
            borderBottom: tab === t.key ? '2px solid #C9A96E' : '2px solid transparent',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            color: tab === t.key ? '#C9A96E' : 'var(--text-tertiary)',
          }}>
            <t.icon size={18} />
            <span style={{ fontSize: 10, fontWeight: tab === t.key ? 700 : 400 }}>{t.label}</span>
          </button>
        ))}
      </div>

      <div style={{ padding: 16 }}>
        {/* ── POSTS ── */}
        {tab === 'posts' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
              <button onClick={() => { setPostLang('ru'); setEditingPost({ ...EMPTY_POST, date: new Date().toISOString().slice(0, 10) }); }}
                style={{ ...BTN_GOLD, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Plus size={16} /> Новый пост
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {posts.map((post, i) => (
                <motion.div key={post._id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
                  className="card" style={{ padding: 12 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    {post.photos?.[0]
                      ? <img src={post.photos[0]} alt="" style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                      : post.videos?.length ? <div style={{ width: 52, height: 52, borderRadius: 8, background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Video size={20} color="#fff" /></div>
                      : <div style={{ width: 52, height: 52, borderRadius: 8, background: 'var(--bg-secondary)', flexShrink: 0 }} />
                    }
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', gap: 5, marginBottom: 2, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>{post.date}</span>
                        {post.tags.map(t => <span key={t} style={{ fontSize: 9, padding: '1px 5px', borderRadius: 4, background: 'var(--bg-secondary)', color: 'var(--text-tertiary)' }}>{t}</span>)}
                      </div>
                      <p style={{ fontSize: 13, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title?.ru || '—'}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.body?.ru || ''}</p>
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                      <button onClick={() => { setPostLang('ru'); setEditingPost({ ...post }); }} style={{ background: 'var(--bg-secondary)', border: 'none', borderRadius: 8, padding: '7px 8px', cursor: 'pointer' }}>
                        <Edit2 size={13} color="var(--text-secondary)" />
                      </button>
                      <button onClick={async () => { if (!window.confirm('Удалить пост?')) return; await deletePost(secret, post._id); setPosts(p => p.filter(x => x._id !== post._id)); }}
                        style={{ background: 'rgba(255,59,92,0.1)', border: 'none', borderRadius: 8, padding: '7px 8px', cursor: 'pointer' }}>
                        <Trash2 size={13} color="#ff3b5c" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* ── EVENTS ── */}
        {tab === 'events' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
              <button onClick={() => { setEventLang('ru'); setEditingEvent({ ...EMPTY_EVENT, sortDate: new Date().toISOString().slice(0,10) }); }}
                style={{ ...BTN_GOLD, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Plus size={16} /> Новое событие
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {events.map((ev, i) => (
                <motion.div key={ev._id || i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
                  className="card" style={{ padding: 12 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <div style={{ width: 8, alignSelf: 'stretch', borderRadius: 4, background: ev.color || '#5E9ED6', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 2 }}>{ev.sortDate || ev.date?.ru || '—'}</p>
                      <p style={{ fontSize: 13, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.title?.ru || '—'}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{ev.address}</p>
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                      <button onClick={() => { setEventLang('ru'); setEditingEvent({ ...ev }); }} style={{ background: 'var(--bg-secondary)', border: 'none', borderRadius: 8, padding: '7px 8px', cursor: 'pointer' }}>
                        <Edit2 size={13} color="var(--text-secondary)" />
                      </button>
                      <button onClick={async () => { if (!window.confirm('Удалить событие?')) return; await deleteEvent(secret, ev._id); setEvents(e => e.filter(x => x._id !== ev._id)); }}
                        style={{ background: 'rgba(255,59,92,0.1)', border: 'none', borderRadius: 8, padding: '7px 8px', cursor: 'pointer' }}>
                        <Trash2 size={13} color="#ff3b5c" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
              {events.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 13, padding: 20 }}>Нет событий. Создай первое!</p>}
            </div>
          </>
        )}

        {/* ── GROUPS ── */}
        {tab === 'groups' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
              <button onClick={() => { setGroupLang('ru'); setEditingGroup({ ...EMPTY_GROUP }); }}
                style={{ ...BTN_GOLD, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Plus size={16} /> Новая группа
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {groups.map((g, i) => (
                <motion.div key={g._id || g.id || i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
                  className="card" style={{ padding: 12 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    {g.photo
                      ? <img src={g.photo} alt="" style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                      : <div style={{ width: 52, height: 52, borderRadius: 8, background: '#9B7FD415', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Home size={20} color="#9B7FD4" /></div>
                    }
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 700 }}>{g.city || '—'}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.address}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{g.day?.ru || '—'}, {g.time}{g.leader ? ` · ${g.leader}` : ''}</p>
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                      <button onClick={() => { setGroupLang('ru'); setEditingGroup({ ...g, _id: g._id || g.id }); }} style={{ background: 'var(--bg-secondary)', border: 'none', borderRadius: 8, padding: '7px 8px', cursor: 'pointer' }}>
                        <Edit2 size={13} color="var(--text-secondary)" />
                      </button>
                      <button onClick={async () => {
                        if (!window.confirm('Удалить группу?')) return;
                        const id = g._id || g.id;
                        await deleteHomeGroup(secret, id);
                        setGroups(gs => gs.filter(x => (x._id || x.id) !== id));
                      }} style={{ background: 'rgba(255,59,92,0.1)', border: 'none', borderRadius: 8, padding: '7px 8px', cursor: 'pointer' }}>
                        <Trash2 size={13} color="#ff3b5c" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* ── STATS ── */}
        {tab === 'stats' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>Цифры отображаются на главной странице.</p>
            {([
              { key: 'attendees', label: 'Прихожан' },
              { key: 'youth', label: 'Молодёжь' },
              { key: 'children', label: 'Дети' },
              { key: 'homeGroups', label: 'Домашние группы' },
              { key: 'ministries', label: 'Служения' },
            ] as const).map(({ key, label }) => (
              <div key={key}>
                <label style={LABEL}>{label.toUpperCase()}</label>
                <input type="number" min={0} value={(stats as any)[key]} onChange={e => setStats({ ...stats, [key]: +e.target.value })}
                  style={{ ...INPUT, fontSize: 20, fontWeight: 700 }} />
              </div>
            ))}
            <button onClick={async () => {
              setSavingStats(true); hapticFeedback('medium');
              await updateStats(secret, stats);
              setSavingStats(false); setStatsSaved(true);
              setTimeout(() => setStatsSaved(false), 2000);
            }} style={{ ...BTN_GOLD, padding: 14, fontSize: 15, marginTop: 4 }}>
              {statsSaved ? '✓ Сохранено' : savingStats ? 'Сохранение...' : 'Сохранить статистику'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
