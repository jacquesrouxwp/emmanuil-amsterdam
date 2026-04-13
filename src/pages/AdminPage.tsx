import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Edit2, Trash2, X, Image } from 'lucide-react';
import { hapticFeedback } from '@/lib/telegram';
import { fetchPosts, createPost, updatePost, deletePost, seedPosts, type ApiPost } from '@/lib/api';
import { blogPosts } from '@/data/blog';

const ADMIN_SECRET_KEY = 'emmanuil_admin_secret';

const EMPTY: Omit<ApiPost, '_id'> = {
  date: new Date().toISOString().slice(0, 10),
  tags: ['general'],
  photos: [],
  videos: [],
  title: { ua: '', ru: '', en: '', nl: '', es: '' },
  body:  { ua: '', ru: '', en: '', nl: '', es: '' },
};

type EditPost = Omit<ApiPost, '_id'> & { _id?: string };

export function AdminPage() {
  const navigate = useNavigate();
  const [secret, setSecret] = useState(() => localStorage.getItem(ADMIN_SECRET_KEY) || '');
  const [authed, setAuthed] = useState(false);
  const [authInput, setAuthInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  const [posts, setPosts] = useState<ApiPost[]>([]);
  const [editing, setEditing] = useState<EditPost | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeLang, setActiveLang] = useState<'ru' | 'ua' | 'en' | 'nl' | 'es'>('ru');
  const [seeded, setSeeded] = useState(false);

  useEffect(() => { if (secret) tryAuth(secret); }, []);

  async function tryAuth(s: string) {
    setLoading(true);
    try {
      const res = await fetch('/api/posts', { headers: { 'x-admin-secret': s } });
      if (res.ok) {
        setSecret(s);
        localStorage.setItem(ADMIN_SECRET_KEY, s);
        setAuthed(true);
        setPosts(await res.json());
      } else {
        setAuthError('Неверный пароль');
      }
    } catch { setAuthError('Ошибка подключения'); }
    setLoading(false);
  }

  async function handleSeed() {
    try {
      await seedPosts(secret, blogPosts.map(p => ({ ...p, _id: (p as any).id } as any)));
      setSeeded(true);
      setPosts(await fetchPosts());
    } catch {}
  }

  async function handleSave() {
    if (!editing) return;
    if (!editing.title.ru?.trim() || !editing.body.ru?.trim()) return;
    setSaving(true);
    hapticFeedback('medium');
    try {
      if (editing._id) {
        const updated = await updatePost(secret, editing._id, editing);
        setPosts(prev => prev.map(p => p._id === editing._id ? updated : p));
      } else {
        const created = await createPost(secret, editing);
        setPosts(prev => [created, ...prev]);
      }
      setEditing(null);
    } catch {}
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Удалить пост?')) return;
    hapticFeedback('medium');
    await deletePost(secret, id);
    setPosts(prev => prev.filter(p => p._id !== id));
  }

  function addPhoto() {
    if (!editing) return;
    const url = window.prompt('Ссылка на фото (например с ibb.co):');
    if (url?.trim()) setEditing({ ...editing, photos: [...editing.photos, url.trim()] });
  }

  function removePhoto(idx: number) {
    if (!editing) return;
    setEditing({ ...editing, photos: editing.photos.filter((_, i) => i !== idx) });
  }

  // ── Login ──────────────────────────────────────────────────
  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'var(--bg-primary)' }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Emmanuil Admin</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 28 }}>Введи пароль для входа</p>
        <input
          type="password"
          value={authInput}
          onChange={e => setAuthInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && tryAuth(authInput)}
          placeholder="Пароль"
          style={{
            width: '100%', maxWidth: 300, padding: '12px 14px', borderRadius: 12,
            border: '1px solid var(--border-light)', background: 'var(--bg-secondary)',
            color: 'var(--text-primary)', fontSize: 16, marginBottom: 10, boxSizing: 'border-box',
          }}
        />
        {authError && <p style={{ color: '#ff3b5c', fontSize: 13, marginBottom: 10 }}>{authError}</p>}
        <button
          onClick={() => tryAuth(authInput)}
          disabled={loading || !authInput}
          style={{
            width: '100%', maxWidth: 300, padding: 14, borderRadius: 12,
            background: '#C9A96E', color: '#fff', fontWeight: 700, fontSize: 16,
            border: 'none', cursor: 'pointer', opacity: loading || !authInput ? 0.5 : 1,
          }}
        >
          {loading ? 'Вход...' : 'Войти'}
        </button>
      </div>
    );
  }

  const langs = [
    { key: 'ru' as const, label: 'RU' }, { key: 'ua' as const, label: 'UA' },
    { key: 'en' as const, label: 'EN' }, { key: 'nl' as const, label: 'NL' },
    { key: 'es' as const, label: 'ES' },
  ];

  // ── Editor ─────────────────────────────────────────────────
  if (editing) {
    const canSave = !!editing.title.ru?.trim() && !!editing.body.ru?.trim();
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: 100 }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px', borderBottom: '1px solid var(--border-light)',
          position: 'sticky', top: 0, background: 'var(--bg-primary)', zIndex: 10,
        }}>
          <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <X size={22} color="var(--text-secondary)" />
          </button>
          <h2 style={{ fontSize: 17, fontWeight: 700 }}>{editing._id ? 'Редактировать' : 'Новый пост'}</h2>
          <button
            onClick={handleSave}
            disabled={saving || !canSave}
            style={{
              background: canSave ? '#C9A96E' : 'var(--bg-secondary)', border: 'none',
              borderRadius: 10, padding: '8px 16px', color: canSave ? '#fff' : 'var(--text-tertiary)',
              fontWeight: 700, fontSize: 14, cursor: canSave ? 'pointer' : 'default', transition: 'all 0.15s',
            }}
          >
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>

        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Date + tags */}
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 11, color: 'var(--text-tertiary)', display: 'block', marginBottom: 6 }}>ДАТА</label>
              <input
                type="date"
                value={editing.date}
                onChange={e => setEditing({ ...editing, date: e.target.value })}
                style={{
                  width: '100%', padding: '9px 12px', borderRadius: 10, fontSize: 14,
                  border: '1px solid var(--border-light)', background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)', boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: 11, color: 'var(--text-tertiary)', display: 'block', marginBottom: 6 }}>ТЕГ</label>
              <div style={{ display: 'flex', gap: 6 }}>
                {(['general', 'youth'] as const).map(tag => (
                  <button key={tag} onClick={() => setEditing({ ...editing, tags: [tag] })} style={{
                    padding: '9px 12px', borderRadius: 10, fontSize: 13, border: 'none', cursor: 'pointer',
                    background: editing.tags.includes(tag) ? '#C9A96E' : 'var(--bg-secondary)',
                    color: editing.tags.includes(tag) ? '#fff' : 'var(--text-secondary)',
                    fontWeight: editing.tags.includes(tag) ? 700 : 400,
                  }}>
                    {tag === 'general' ? 'Общее' : 'Молодёжь'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Photos */}
          <div>
            <label style={{ fontSize: 11, color: 'var(--text-tertiary)', display: 'block', marginBottom: 8 }}>ФОТО</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {editing.photos.map((url, i) => (
                <div key={i} style={{ position: 'relative', width: 76, height: 76 }}>
                  <img src={url} alt="" style={{ width: 76, height: 76, objectFit: 'cover', borderRadius: 12 }} />
                  <button onClick={() => removePhoto(i)} style={{
                    position: 'absolute', top: -6, right: -6, width: 20, height: 20,
                    borderRadius: '50%', background: '#ff3b5c', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <X size={11} color="#fff" />
                  </button>
                </div>
              ))}
              <button onClick={addPhoto} style={{
                width: 76, height: 76, borderRadius: 12, border: '2px dashed var(--border-light)',
                background: 'var(--bg-secondary)', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
              }}>
                <Image size={20} color="var(--text-tertiary)" />
                <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>Добавить</span>
              </button>
            </div>
          </div>

          {/* Videos */}
          <div>
            <label style={{ fontSize: 11, color: 'var(--text-tertiary)', display: 'block', marginBottom: 8 }}>ВИДЕО (YouTube)</label>
            {(editing.videos || []).map((url, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                <input
                  type="text"
                  value={url}
                  readOnly
                  style={{
                    flex: 1, padding: '8px 10px', borderRadius: 10, fontSize: 13,
                    border: '1px solid var(--border-light)', background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)', boxSizing: 'border-box',
                  }}
                />
                <button onClick={() => setEditing({ ...editing, videos: (editing.videos || []).filter((_, vi) => vi !== i) })} style={{
                  width: 32, height: 32, borderRadius: 8, background: 'rgba(255,59,92,0.1)',
                  border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <X size={14} color="#ff3b5c" />
                </button>
              </div>
            ))}
            <button onClick={() => {
              const url = window.prompt('Ссылка на YouTube видео:');
              if (url?.trim()) setEditing({ ...editing, videos: [...(editing.videos || []), url.trim()] });
            }} style={{
              padding: '8px 14px', borderRadius: 10, border: '2px dashed var(--border-light)',
              background: 'var(--bg-secondary)', cursor: 'pointer', fontSize: 13, color: 'var(--text-secondary)',
            }}>
              + Добавить видео
            </button>
          </div>

          {/* Lang tabs */}
          <div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
              {langs.map(l => (
                <button key={l.key} onClick={() => setActiveLang(l.key)} style={{
                  padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                  border: 'none', cursor: 'pointer',
                  background: activeLang === l.key ? '#C9A96E' : 'var(--bg-secondary)',
                  color: activeLang === l.key ? '#fff' : 'var(--text-secondary)',
                }}>
                  {l.label}
                </button>
              ))}
            </div>

            <label style={{ fontSize: 11, color: 'var(--text-tertiary)', display: 'block', marginBottom: 6 }}>
              ЗАГОЛОВОК {activeLang === 'ru' && <span style={{ color: '#ff3b5c' }}>*</span>}
            </label>
            <input
              type="text"
              value={editing.title[activeLang] || ''}
              onChange={e => setEditing({ ...editing, title: { ...editing.title, [activeLang]: e.target.value } })}
              placeholder="Заголовок..."
              style={{
                width: '100%', padding: '10px 12px', borderRadius: 10, fontSize: 15, fontWeight: 600,
                border: '1px solid var(--border-light)', background: 'var(--bg-secondary)',
                color: 'var(--text-primary)', boxSizing: 'border-box', marginBottom: 12,
              }}
            />

            <label style={{ fontSize: 11, color: 'var(--text-tertiary)', display: 'block', marginBottom: 6 }}>
              ТЕКСТ {activeLang === 'ru' && <span style={{ color: '#ff3b5c' }}>*</span>}
            </label>
            <textarea
              value={editing.body[activeLang] || ''}
              onChange={e => setEditing({ ...editing, body: { ...editing.body, [activeLang]: e.target.value } })}
              placeholder="Текст поста..."
              rows={8}
              style={{
                width: '100%', padding: '10px 12px', borderRadius: 10, fontSize: 14, lineHeight: 1.55,
                border: '1px solid var(--border-light)', background: 'var(--bg-secondary)',
                color: 'var(--text-primary)', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit',
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  // ── Posts list ─────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: 80 }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 16px', borderBottom: '1px solid var(--border-light)',
        position: 'sticky', top: 0, background: 'var(--bg-primary)', zIndex: 10,
      }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <ArrowLeft size={22} color="var(--text-secondary)" />
        </button>
        <h2 style={{ fontSize: 17, fontWeight: 700 }}>Админ панель</h2>
        <button
          onClick={() => { setActiveLang('ru'); setEditing({ ...EMPTY, date: new Date().toISOString().slice(0, 10) }); }}
          style={{
            background: '#C9A96E', border: 'none', borderRadius: 10, padding: '8px 14px',
            color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          <Plus size={16} /> Пост
        </button>
      </div>

      <div style={{ padding: 16 }}>
        {posts.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: 20, marginBottom: 16 }}>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>
              База пустая — перенести существующие посты из приложения?
            </p>
            <button onClick={handleSeed} disabled={seeded} style={{
              padding: '10px 22px', borderRadius: 10, background: '#C9A96E',
              color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer', opacity: seeded ? 0.6 : 1,
            }}>
              {seeded ? 'Перенесено ✓' : 'Перенести посты'}
            </button>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {posts.map((post, i) => (
            <motion.div key={post._id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="card" style={{ padding: 14 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                {post.photos?.[0] && (
                  <img src={post.photos[0]} alt="" style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }} />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: 6, marginBottom: 2 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{post.date}</span>
                    {post.tags.map(t => (
                      <span key={t} style={{
                        fontSize: 10, padding: '1px 6px', borderRadius: 5,
                        background: t === 'youth' ? 'rgba(201,169,110,0.15)' : 'var(--bg-secondary)',
                        color: t === 'youth' ? '#C9A96E' : 'var(--text-tertiary)',
                      }}>{t === 'youth' ? 'Молодёжь' : 'Общее'}</span>
                    ))}
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {post.title?.ru || post.title?.en || '—'}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {post.body?.ru || post.body?.en || ''}
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                  <button onClick={() => { setActiveLang('ru'); setEditing({ ...post }); }} style={{
                    background: 'var(--bg-secondary)', border: 'none', borderRadius: 8, padding: '7px 9px', cursor: 'pointer',
                  }}>
                    <Edit2 size={14} color="var(--text-secondary)" />
                  </button>
                  <button onClick={() => handleDelete(post._id)} style={{
                    background: 'rgba(255,59,92,0.1)', border: 'none', borderRadius: 8, padding: '7px 9px', cursor: 'pointer',
                  }}>
                    <Trash2 size={14} color="#ff3b5c" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
