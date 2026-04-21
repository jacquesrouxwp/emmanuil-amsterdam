import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, Plus, Edit2, Trash2, X,
  Loader2, Image, Video, Tag, Calendar,
} from 'lucide-react';
import { hapticFeedback } from '@/lib/telegram';
import { useUserStore } from '@/store/userStore';
import {
  fetchPosts, createPost, updatePost, deletePost, type ApiPost,
} from '@/lib/api';

// ── Стилі ──────────────────────────────────────────────────────────────────
const INPUT: React.CSSProperties = {
  width: '100%', padding: '11px 13px', borderRadius: 11, fontSize: 14,
  border: '1px solid var(--border-light)', background: 'var(--bg)',
  color: 'var(--text-primary)', lineHeight: 1.5,
};
const LABEL: React.CSSProperties = {
  fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)',
  display: 'block', marginBottom: 5, letterSpacing: 0.7, textTransform: 'uppercase',
};

const LANGS = ['ua', 'ru', 'en'] as const;
type Lang = typeof LANGS[number];
const LANG_LABEL: Record<Lang, string> = { ua: '🇺🇦 UA', ru: '🇷🇺 RU', en: '🇬🇧 EN' };

function emptyPost(churchId: string): Omit<ApiPost, '_id'> {
  return {
    churchId,
    date: new Date().toISOString().slice(0, 10),
    tags: [],
    photos: [],
    videos: [],
    title: { ua: '', ru: '', en: '' },
    body: { ua: '', ru: '', en: '' },
  };
}

// ── Картка поста у списку ──────────────────────────────────────────────────
function PostCard({ post, onEdit, onDelete }: {
  post: ApiPost;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const title = post.title?.ua || post.title?.ru || post.title?.en || '(без назви)';
  const body = post.body?.ua || post.body?.ru || post.body?.en || '';
  const [confirming, setConfirming] = useState(false);

  return (
    <motion.div layout
      style={{
        padding: '14px 16px', borderRadius: 16,
        background: 'var(--bg-secondary)', border: '1px solid var(--border-light)',
        display: 'flex', flexDirection: 'column', gap: 10,
      }}
    >
      {/* Фото прев'ю */}
      {post.photos?.[0] && (
        <img src={post.photos[0]} alt="" style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 10 }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
      )}

      <div>
        <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{title}</p>
        <p style={{ fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {body}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{post.date}</p>
          {post.tags?.map((t) => (
            <span key={t} style={{
              fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 20,
              background: 'rgba(94,158,214,0.1)', color: 'var(--primary)',
            }}>{t}</span>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onEdit}
            style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(94,158,214,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Edit2 size={13} color="var(--primary)" />
          </button>

          {confirming ? (
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => { hapticFeedback('medium'); onDelete(); }}
                style={{ padding: '4px 10px', borderRadius: 9, background: 'rgba(255,59,48,0.15)', color: '#FF3B30', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                Видалити
              </button>
              <button onClick={() => setConfirming(false)}
                style={{ padding: '4px 10px', borderRadius: 9, background: 'var(--bg)', color: 'var(--text-tertiary)', fontSize: 12, cursor: 'pointer' }}>
                Ні
              </button>
            </div>
          ) : (
            <button onClick={() => setConfirming(true)}
              style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(255,59,48,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Trash2 size={13} color="#FF3B30" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── Редактор поста ─────────────────────────────────────────────────────────
function PostEditor({ post, onSave, onCancel, saving }: {
  post: Omit<ApiPost, '_id'> & { _id?: string };
  onSave: (p: typeof post) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [draft, setDraft] = useState(post);
  const [lang, setLang] = useState<Lang>('ua');
  const [photoInput, setPhotoInput] = useState(draft.photos.join('\n'));
  const [tagInput, setTagInput] = useState(draft.tags.join(', '));

  const canSave = !!(draft.title.ua?.trim() || draft.title.ru?.trim() || draft.title.en?.trim());

  function syncPhotos(val: string) {
    setPhotoInput(val);
    setDraft({ ...draft, photos: val.split('\n').map((u) => u.trim()).filter(Boolean) });
  }
  function syncTags(val: string) {
    setTagInput(val);
    setDraft({ ...draft, tags: val.split(',').map((t) => t.trim()).filter(Boolean) });
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px', borderBottom: '1px solid var(--border-light)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
      }}>
        <button onClick={onCancel}
          style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, color: 'var(--text-tertiary)', cursor: 'pointer' }}>
          <X size={18} />
        </button>
        <p style={{ fontSize: 15, fontWeight: 700 }}>{draft._id ? 'Редагувати пост' : 'Новий пост'}</p>
        <button onClick={() => onSave(draft)} disabled={saving || !canSave}
          style={{
            padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: canSave ? 'pointer' : 'default',
            background: canSave ? 'var(--primary)' : 'var(--bg-secondary)',
            color: canSave ? '#fff' : 'var(--text-tertiary)',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
          {saving ? <><Loader2 size={13} /> Збереження...</> : 'Зберегти'}
        </button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 48 }}>

        {/* Мова */}
        <div style={{ display: 'flex', gap: 8 }}>
          {LANGS.map((l) => (
            <button key={l} onClick={() => setLang(l)}
              style={{
                flex: 1, padding: '8px', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                background: lang === l ? 'var(--primary)' : 'var(--bg-secondary)',
                color: lang === l ? '#fff' : 'var(--text-tertiary)',
                border: `1px solid ${lang === l ? 'var(--primary)' : 'var(--border-light)'}`,
              }}>
              {LANG_LABEL[l]}
            </button>
          ))}
        </div>

        {/* Заголовок */}
        <div>
          <label style={LABEL}>Заголовок ({lang.toUpperCase()})</label>
          <input
            value={draft.title[lang] || ''}
            onChange={(e) => setDraft({ ...draft, title: { ...draft.title, [lang]: e.target.value } })}
            placeholder="Назва публікації..."
            style={INPUT}
          />
        </div>

        {/* Текст */}
        <div>
          <label style={LABEL}>Текст ({lang.toUpperCase()})</label>
          <textarea
            value={draft.body[lang] || ''}
            onChange={(e) => setDraft({ ...draft, body: { ...draft.body, [lang]: e.target.value } })}
            placeholder="Поділіться думкою, свідченням, словом..."
            rows={6}
            style={{ ...INPUT, resize: 'none' }}
          />
        </div>

        {/* Дата */}
        <div>
          <label style={{ ...LABEL, display: 'flex', alignItems: 'center', gap: 5 }}>
            <Calendar size={11} /> Дата
          </label>
          <input type="date" value={draft.date}
            onChange={(e) => setDraft({ ...draft, date: e.target.value })}
            style={INPUT} />
        </div>

        {/* Фото */}
        <div>
          <label style={{ ...LABEL, display: 'flex', alignItems: 'center', gap: 5 }}>
            <Image size={11} /> Фото (по одному посиланню на рядок)
          </label>
          <textarea value={photoInput} onChange={(e) => syncPhotos(e.target.value)}
            placeholder="https://images.unsplash.com/photo-xxx" rows={3}
            style={{ ...INPUT, resize: 'none', fontFamily: 'monospace', fontSize: 12 }} />
          {/* Preview */}
          {draft.photos.length > 0 && (
            <div style={{ display: 'flex', gap: 8, marginTop: 8, overflowX: 'auto' }}>
              {draft.photos.slice(0, 4).map((u, i) => (
                <img key={i} src={u} alt="" style={{ width: 72, height: 72, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }}
                  onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.3'; }} />
              ))}
            </div>
          )}
        </div>

        {/* Відео */}
        <div>
          <label style={{ ...LABEL, display: 'flex', alignItems: 'center', gap: 5 }}>
            <Video size={11} /> Відео (YouTube/Vimeo посилання, по одному на рядок)
          </label>
          <textarea
            value={(draft.videos || []).join('\n')}
            onChange={(e) => setDraft({ ...draft, videos: e.target.value.split('\n').map((u) => u.trim()).filter(Boolean) })}
            placeholder="https://youtube.com/watch?v=..." rows={2}
            style={{ ...INPUT, resize: 'none', fontFamily: 'monospace', fontSize: 12 }} />
        </div>

        {/* Теги */}
        <div>
          <label style={{ ...LABEL, display: 'flex', alignItems: 'center', gap: 5 }}>
            <Tag size={11} /> Теги (через кому)
          </label>
          <input value={tagInput} onChange={(e) => syncTags(e.target.value)}
            placeholder="проповідь, свідчення, молодь" style={INPUT} />
        </div>

      </div>
    </div>
  );
}

// ── Головна сторінка менеджера постів ─────────────────────────────────────
export function MyChurchPostsManager() {
  const navigate = useNavigate();
  const { churchId } = useUserStore();
  const secret = localStorage.getItem('emmanuil_admin_secret') || '';

  const [posts, setPosts] = useState<ApiPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<(Omit<ApiPost, '_id'> & { _id?: string }) | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!churchId) return;
    fetchPosts(churchId).then((p) => setPosts(p)).finally(() => setLoading(false));
  }, [churchId]);

  async function handleSave(draft: Omit<ApiPost, '_id'> & { _id?: string }) {
    if (!churchId) return;
    setSaving(true);
    hapticFeedback('medium');
    try {
      const payload = { ...draft, churchId };
      if (draft._id) {
        const updated = await updatePost(secret, draft._id, payload);
        setPosts((p) => p.map((x) => x._id === draft._id ? updated : x));
      } else {
        const created = await createPost(secret, payload as Omit<ApiPost, '_id'>);
        setPosts((p) => [created, ...p]);
      }
      setEditingPost(null);
    } catch (e: any) {
      alert('Помилка: ' + (e?.message || 'невідома'));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    hapticFeedback('medium');
    try {
      await deletePost(secret, id);
      setPosts((p) => p.filter((x) => x._id !== id));
    } catch (e: any) {
      alert('Помилка видалення: ' + (e?.message || 'невідома'));
    }
  }

  return (
    <>
      <div style={{ minHeight: '100%', overflowY: 'auto', background: 'var(--bg)', paddingBottom: 90 }}>

        {/* Header */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 10,
          background: 'var(--bg)', borderBottom: '1px solid var(--border-light)',
          padding: '14px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <button onClick={() => navigate('/my-church')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}>
            <ChevronLeft size={18} /> Назад
          </button>
          <p style={{ fontSize: 15, fontWeight: 700 }}>Пости</p>
          <button
            onClick={() => { hapticFeedback('light'); setEditingPost(emptyPost(churchId || '')); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 14px', borderRadius: 10, fontSize: 13, fontWeight: 700,
              background: 'var(--primary)', color: '#fff', cursor: 'pointer',
            }}>
            <Plus size={14} /> Новий
          </button>
        </div>

        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>

          {loading && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 0' }}>
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                <Loader2 size={28} color="var(--primary)" />
              </motion.div>
            </div>
          )}

          {!loading && posts.length === 0 && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              style={{ textAlign: 'center', padding: '48px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'rgba(94,158,214,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 28 }}>📝</span>
              </div>
              <div>
                <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
                  Ще немає публікацій
                </p>
                <p style={{ fontSize: 13, color: 'var(--text-tertiary)', lineHeight: 1.5 }}>
                  Поділіться першою думкою, свідченням або проповіддю
                </p>
              </div>
              <button
                onClick={() => { hapticFeedback('light'); setEditingPost(emptyPost(churchId || '')); }}
                style={{
                  padding: '12px 24px', borderRadius: 12, fontSize: 14, fontWeight: 700,
                  background: 'var(--primary)', color: '#fff', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                <Plus size={16} /> Створити перший пост
              </button>
            </motion.div>
          )}

          <AnimatePresence>
            {posts.map((post) => (
              <motion.div key={post._id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
                <PostCard
                  post={post}
                  onEdit={() => setEditingPost({ ...post })}
                  onDelete={() => handleDelete(post._id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>

        </div>
      </div>

      {/* Editor overlay */}
      <AnimatePresence>
        {editingPost && (
          <PostEditor
            post={editingPost}
            onSave={handleSave}
            onCancel={() => setEditingPost(null)}
            saving={saving}
          />
        )}
      </AnimatePresence>
    </>
  );
}
