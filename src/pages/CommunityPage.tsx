import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, MessageCircle, Heart, Share2, Newspaper, MessageSquare,
  BookOpen, Target, Gift, X, Send, ChevronDown, ChevronUp,
} from 'lucide-react';
import { communityPosts, type CommunityPost, type PostType } from '@/data/communityPosts';
import {
  fetchReactions, likePost, fetchComments, addComment,
  type PostReaction, type PostComment,
} from '@/lib/api';
import { useLang } from '@/i18n/translations';
import { hapticFeedback } from '@/lib/telegram';

// ── Post type config ──────────────────────────────────────────────────────────

const POST_TYPE_CONFIG: Record<PostType, { label: string; color: string; bg: string; Icon: React.ElementType }> = {
  update:     { label: 'Оновлення',   color: '#5E9ED6', bg: 'rgba(94,158,214,0.12)',  Icon: Newspaper },
  discussion: { label: 'Обговорення', color: '#9B59B6', bg: 'rgba(155,89,182,0.12)',  Icon: MessageSquare },
  prayer:     { label: 'Молитва',     color: '#E8709A', bg: 'rgba(232,112,154,0.12)', Icon: Heart },
  resource:   { label: 'Ресурс',      color: '#E89C4E', bg: 'rgba(232,156,78,0.12)',  Icon: BookOpen },
  project:    { label: 'Проект',      color: '#4CAF50', bg: 'rgba(76,175,80,0.12)',   Icon: Target },
  offer:      { label: 'Пропозиція',  color: '#20B2AA', bg: 'rgba(32,178,170,0.12)',  Icon: Gift },
};

const TABS: { key: PostType | 'all'; label: string }[] = [
  { key: 'all',        label: 'Всі' },
  { key: 'discussion', label: 'Обговорення' },
  { key: 'prayer',     label: 'Молитва' },
  { key: 'resource',   label: 'Ресурси' },
  { key: 'project',    label: 'Проекти' },
  { key: 'offer',      label: 'Пропозиції' },
  { key: 'update',     label: 'Новини' },
];

// ── Avatar initials ───────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  ['#1a3a5c', '#2d5a8e'], ['#5c2d1a', '#8e5a2d'],
  ['#1a5c3a', '#2d8e5a'], ['#5c1a5a', '#8e2d8a'],
  ['#3a1a5c', '#5a2d8e'], ['#5c3a1a', '#8e5a2d'],
];

function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const initials = name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  const colorIdx = name.charCodeAt(0) % AVATAR_COLORS.length;
  const [from, to] = AVATAR_COLORS[colorIdx];
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: `linear-gradient(135deg, ${from}, ${to})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <span style={{ fontSize: size * 0.36, fontWeight: 700, color: '#fff' }}>{initials}</span>
    </div>
  );
}

// ── Time ago ──────────────────────────────────────────────────────────────────

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'щойно';
  if (m < 60) return `${m} хв`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} год`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d} дн`;
  return new Date(iso).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' });
}

// ── Comment section ───────────────────────────────────────────────────────────

function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<PostComment[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchComments(postId).then((c) => { setComments(c); setLoaded(true); });
  }, [postId]);

  const send = async () => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    hapticFeedback('medium');
    setSending(true);
    const tg = (window as any).Telegram?.WebApp;
    const user = tg?.initDataUnsafe?.user;
    const userId = user?.id?.toString() || 'anon';
    const name = user ? `${user.first_name}${user.last_name ? ' ' + user.last_name : ''}` : 'Гість';
    const photo = user?.photo_url;
    try {
      const c = await addComment(postId, { userId, name, photo, text: trimmed });
      setComments((prev) => [...prev, c]);
      setText('');
    } catch { /* offline */ }
    setSending(false);
  };

  return (
    <div style={{ padding: '0 14px 12px' }}>
      {/* Input */}
      <div style={{ display: 'flex', gap: 8, marginBottom: loaded && comments.length > 0 ? 12 : 0 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
          placeholder="Написати коментар..."
          style={{
            flex: 1, padding: '8px 12px', borderRadius: 20, fontSize: 13,
            background: 'var(--bg-secondary)', border: '1px solid var(--border-light)',
            color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit',
          }}
        />
        <button
          onClick={send}
          disabled={!text.trim() || sending}
          style={{
            width: 34, height: 34, borderRadius: '50%', border: 'none', cursor: 'pointer',
            flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: text.trim() ? '#5E9ED6' : 'var(--bg-secondary)',
            opacity: sending ? 0.5 : 1, transition: 'background 0.15s',
          }}
        >
          <Send size={13} color={text.trim() ? '#fff' : 'var(--text-tertiary)'} />
        </button>
      </div>
      {/* List */}
      {comments.map((c) => (
        <div key={c.id} style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          <Avatar name={c.name} size={26} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 700 }}>{c.name}</span>
              <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>{timeAgo(c.createdAt)}</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.4, marginTop: 2 }}>{c.text}</p>
          </div>
        </div>
      ))}
      {loaded && comments.length === 0 && (
        <p style={{ fontSize: 12, color: 'var(--text-tertiary)', textAlign: 'center', padding: '8px 0' }}>
          Поки немає коментарів
        </p>
      )}
    </div>
  );
}

// ── Post card ─────────────────────────────────────────────────────────────────

function PostCard({ post, reactions, liked, onLike }: {
  post: CommunityPost;
  reactions: Record<string, PostReaction>;
  liked: Set<string>;
  onLike: (id: string) => void;
}) {
  const cfg = POST_TYPE_CONFIG[post.type];
  const [expanded, setExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const isLiked = liked.has(post.id);
  const likes = reactions[post.id]?.likes ?? (post.likeCount || 0);
  const commentCount = reactions[post.id] ? undefined : post.commentCount;

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      {/* Type stripe */}
      <div style={{
        height: 3,
        background: `linear-gradient(90deg, ${cfg.color}, ${cfg.color}80)`,
      }} />

      <div style={{ padding: '12px 14px 0' }}>
        {/* Header: type badge + author */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            background: cfg.bg, borderRadius: 20,
            padding: '3px 10px 3px 6px',
          }}>
            <cfg.Icon size={12} color={cfg.color} />
            <span style={{ fontSize: 11, fontWeight: 700, color: cfg.color, letterSpacing: 0.2 }}>
              {cfg.label}
            </span>
          </div>
          <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{timeAgo(post.date)}</span>
        </div>

        {/* Author row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
          <Avatar name={post.authorName} size={32} />
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>{post.authorName}</p>
            <p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{post.authorRole}</p>
          </div>
        </div>

        {/* Title */}
        <h4 style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.3, marginBottom: 6 }}>
          {post.title}
        </h4>

        {/* Body */}
        <p style={{
          fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.55,
          display: '-webkit-box', WebkitLineClamp: expanded ? undefined : 3,
          WebkitBoxOrient: 'vertical', overflow: expanded ? 'visible' : 'hidden',
        }}>
          {post.body}
        </p>

        {post.body.length > 120 && (
          <button
            onClick={() => { hapticFeedback('light'); setExpanded(!expanded); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 3, marginTop: 4,
              fontSize: 12, fontWeight: 600, color: 'var(--primary)',
              cursor: 'pointer', border: 'none', background: 'none', padding: 0,
            }}
          >
            {expanded ? 'Згорнути' : 'Читати далі'}
            {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        )}

        {/* Actions */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          marginTop: 12, paddingTop: 10, paddingBottom: 14,
          borderTop: '1px solid var(--border-light)',
        }}>
          <button
            onClick={() => onLike(post.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px',
              borderRadius: 20, cursor: 'pointer', transition: 'all 0.15s',
              background: isLiked ? 'rgba(255,59,92,0.1)' : 'var(--bg-secondary)',
              border: `1px solid ${isLiked ? 'rgba(255,59,92,0.3)' : 'var(--border-light)'}`,
            }}
          >
            <Heart size={13} color={isLiked ? '#ff3b5c' : 'var(--text-secondary)'} fill={isLiked ? '#ff3b5c' : 'none'} />
            <span style={{ fontSize: 12, fontWeight: 600, color: isLiked ? '#ff3b5c' : 'var(--text-secondary)' }}>
              {likes}
            </span>
          </button>

          <button
            onClick={() => { hapticFeedback('light'); setShowComments(!showComments); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px',
              borderRadius: 20, cursor: 'pointer', transition: 'all 0.15s',
              background: showComments ? 'rgba(94,158,214,0.1)' : 'var(--bg-secondary)',
              border: `1px solid ${showComments ? 'rgba(94,158,214,0.3)' : 'var(--border-light)'}`,
            }}
          >
            <MessageCircle size={13} color={showComments ? '#5E9ED6' : 'var(--text-secondary)'} />
            <span style={{ fontSize: 12, fontWeight: 600, color: showComments ? '#5E9ED6' : 'var(--text-secondary)' }}>
              {commentCount ?? 0}
            </span>
          </button>

          <button
            style={{
              display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px',
              borderRadius: 20, cursor: 'pointer',
              background: 'var(--bg-secondary)', border: '1px solid var(--border-light)',
            }}
          >
            <Share2 size={13} color="var(--text-secondary)" />
          </button>
        </div>
      </div>

      {/* Comments section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden', borderTop: '1px solid var(--border-light)' }}
          >
            <div style={{ paddingTop: 12 }}>
              <CommentSection postId={post.id} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Create Post Sheet ─────────────────────────────────────────────────────────

function CreatePostSheet({ onClose, onPosted }: { onClose: () => void; onPosted: (post: CommunityPost) => void }) {
  const [type, setType] = useState<PostType>('discussion');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handlePost = () => {
    if (!title.trim()) return;
    hapticFeedback('medium');
    const tg = (window as any).Telegram?.WebApp;
    const user = tg?.initDataUnsafe?.user;
    const name = user ? `${user.first_name}${user.last_name ? ' ' + user.last_name : ''}` : 'Гість';
    const newPost: CommunityPost = {
      id: `cp-new-${Date.now()}`,
      type,
      authorId: 'me',
      authorName: name,
      authorRole: 'Учасник',
      date: new Date().toISOString(),
      title: title.trim(),
      body: body.trim(),
      likeCount: 0,
      commentCount: 0,
    };
    onPosted(newPost);
    onClose();
  };

  const cfg = POST_TYPE_CONFIG[type];

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200 }}
      />
      {/* Sheet */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 350 }}
        style={{
          position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
          width: '100%', maxWidth: 480, zIndex: 201,
          background: 'var(--bg-card)', borderRadius: '20px 20px 0 0',
          padding: '0 0 32px',
          maxHeight: '85vh', overflowY: 'auto',
        }}
      >
        {/* Handle + header */}
        <div style={{ padding: '12px 16px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border)', margin: '0 auto 8px' }} />
        </div>
        <div style={{ padding: '0 16px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)' }}>
          <h3 style={{ fontSize: 17, fontWeight: 700 }}>Новий пост</h3>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', background: 'var(--bg-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={16} color="var(--text-secondary)" />
          </button>
        </div>

        <div style={{ padding: '16px 16px 0' }}>
          {/* Type selector */}
          <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8 }}>
            Тип публікації
          </p>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, marginBottom: 16 }}>
            {(Object.entries(POST_TYPE_CONFIG) as [PostType, typeof POST_TYPE_CONFIG[PostType]][]).map(([key, c]) => {
              const active = type === key;
              return (
                <button
                  key={key}
                  onClick={() => { hapticFeedback('light'); setType(key); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '7px 12px', borderRadius: 20, flexShrink: 0, cursor: 'pointer',
                    border: `1.5px solid ${active ? c.color : 'var(--border-light)'}`,
                    background: active ? c.bg : 'transparent',
                    transition: 'all 0.15s',
                  }}
                >
                  <c.Icon size={13} color={active ? c.color : 'var(--text-tertiary)'} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: active ? c.color : 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                    {c.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Title */}
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Заголовок..."
            style={{
              width: '100%', padding: '11px 14px', borderRadius: 12, fontSize: 15, fontWeight: 600,
              background: 'var(--bg-secondary)', border: `1.5px solid ${title ? cfg.color + '60' : 'var(--border)'}`,
              color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit',
              boxSizing: 'border-box', marginBottom: 10, transition: 'border 0.15s',
            }}
          />

          {/* Body */}
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Поділіться думками, запитом, ресурсом..."
            rows={5}
            style={{
              width: '100%', padding: '11px 14px', borderRadius: 12, fontSize: 14,
              background: 'var(--bg-secondary)', border: '1.5px solid var(--border)',
              color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit',
              boxSizing: 'border-box', resize: 'none', lineHeight: 1.55,
            }}
          />

          {/* Submit */}
          <button
            onClick={handlePost}
            disabled={!title.trim()}
            style={{
              width: '100%', marginTop: 12, padding: '13px 0', borderRadius: 14,
              background: title.trim() ? `linear-gradient(135deg, ${cfg.color}, ${cfg.color}cc)` : 'var(--bg-secondary)',
              color: title.trim() ? '#fff' : 'var(--text-tertiary)',
              fontSize: 15, fontWeight: 700, cursor: title.trim() ? 'pointer' : 'default',
              border: 'none', transition: 'all 0.2s', boxShadow: title.trim() ? `0 4px 16px ${cfg.color}40` : 'none',
            }}
          >
            Опублікувати
          </button>
        </div>
      </motion.div>
    </>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

const LIKED_KEY = 'emmanuil_community_liked';
function getLiked(): Set<string> { try { return new Set(JSON.parse(localStorage.getItem(LIKED_KEY) || '[]')); } catch { return new Set(); } }
function saveLiked(s: Set<string>) { localStorage.setItem(LIKED_KEY, JSON.stringify([...s])); }

export function CommunityPage() {
  const lang = useLang();
  const [activeTab, setActiveTab] = useState<PostType | 'all'>('all');
  const [posts, setPosts] = useState<CommunityPost[]>(communityPosts);
  const [reactions, setReactions] = useState<Record<string, PostReaction>>({});
  const [liked, setLikedState] = useState<Set<string>>(getLiked);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    fetchReactions().then(setReactions);
  }, []);

  const handleLike = async (postId: string) => {
    hapticFeedback('light');
    const isLiked = liked.has(postId);
    const next = new Set(liked);
    isLiked ? next.delete(postId) : next.add(postId);
    setLikedState(next);
    saveLiked(next);
    const base = reactions[postId]?.likes ?? (posts.find(p => p.id === postId)?.likeCount || 0);
    setReactions((prev) => ({
      ...prev,
      [postId]: { likes: Math.max(0, base + (isLiked ? -1 : 1)), shares: prev[postId]?.shares || 0 },
    }));
    try { const r = await likePost(postId, isLiked ? -1 : 1); setReactions((prev) => ({ ...prev, [postId]: r })); } catch { /* offline */ }
  };

  const handlePosted = (post: CommunityPost) => {
    setPosts((prev) => [post, ...prev]);
  };

  const filtered = activeTab === 'all' ? posts : posts.filter((p) => p.type === activeTab);

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 88 }}>
      {/* Header */}
      <div style={{ padding: '16px 16px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>Спільнота</h2>
            <p style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 2 }}>
              {posts.length} публікацій
            </p>
          </div>
          <button
            onClick={() => { hapticFeedback('medium'); setShowCreate(true); }}
            style={{
              width: 40, height: 40, borderRadius: '50%', border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg, #5E9ED6, #3A7BC8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(94,158,214,0.4)',
            }}
          >
            <Plus size={20} color="#fff" />
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none', marginBottom: 14 }}>
          {TABS.map(({ key, label }) => {
            const active = activeTab === key;
            const cfg = key !== 'all' ? POST_TYPE_CONFIG[key as PostType] : null;
            return (
              <button
                key={key}
                onClick={() => { hapticFeedback('light'); setActiveTab(key); }}
                style={{
                  padding: '7px 14px', borderRadius: 20, flexShrink: 0, cursor: 'pointer',
                  fontSize: 13, fontWeight: active ? 700 : 500, whiteSpace: 'nowrap',
                  border: `1.5px solid ${active ? (cfg?.color || 'var(--primary)') : 'var(--border-light)'}`,
                  background: active ? (cfg?.bg || 'rgba(94,158,214,0.12)') : 'transparent',
                  color: active ? (cfg?.color || 'var(--primary)') : 'var(--text-secondary)',
                  transition: 'all 0.15s',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Posts */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <AnimatePresence mode="popLayout">
          {filtered.map((post, idx) => (
            <motion.div
              key={post.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ delay: idx * 0.03 }}
            >
              <PostCard
                post={post}
                reactions={reactions}
                liked={liked}
                onLike={handleLike}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p style={{ fontSize: 32, marginBottom: 8 }}>
              {activeTab === 'prayer' ? '🙏' : activeTab === 'discussion' ? '💬' : activeTab === 'resource' ? '📚' : activeTab === 'project' ? '🚀' : activeTab === 'offer' ? '🤝' : '📝'}
            </p>
            <p style={{ fontSize: 15, fontWeight: 600 }}>Поки немає публікацій</p>
            <p style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 4 }}>
              Будьте першим — натисніть «+»
            </p>
          </div>
        )}
      </div>

      {/* Create post sheet */}
      <AnimatePresence>
        {showCreate && (
          <CreatePostSheet onClose={() => setShowCreate(false)} onPosted={handlePosted} />
        )}
      </AnimatePresence>
    </div>
  );
}
