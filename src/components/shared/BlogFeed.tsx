import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, X, Heart, Share2, MessageCircle, Send } from 'lucide-react';
import { blogPosts, type BlogTag } from '@/data/blog';
import { useLang, loc } from '@/i18n/translations';
import { hapticFeedback, shareUrl } from '@/lib/telegram';
import { fetchReactions, likePost, sharePost, prepareShare, sendPostToUser, fetchComments, addComment, fetchPosts, type PostReaction, type PostComment } from '@/lib/api';

function formatDate(iso: string, lang: string): string {
  const d = new Date(iso);
  const locale = lang === 'ua' ? 'uk-UA' : lang === 'ru' ? 'ru-RU' : lang === 'nl' ? 'nl-NL' : lang === 'es' ? 'es-ES' : 'en-GB';
  return d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
}

/* ── Lightbox (rendered via portal to body) ── */

function Lightbox({ photos, startIndex, onClose }: { photos: string[]; startIndex: number; onClose: () => void }) {
  const [current, setCurrent] = useState(startIndex);
  const [ready, setReady] = useState(false);
  const touchRef = useRef({ x: 0, swiped: false });

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => setReady(true), 120);
    return () => { document.body.style.overflow = ''; clearTimeout(t); };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setCurrent((c) => Math.max(0, c - 1));
      if (e.key === 'ArrowRight') setCurrent((c) => Math.min(photos.length - 1, c + 1));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, photos.length]);

  const goPrev = useCallback(() => { hapticFeedback('light'); setCurrent((c) => Math.max(0, c - 1)); }, []);
  const goNext = useCallback(() => { hapticFeedback('light'); setCurrent((c) => Math.min(photos.length - 1, c + 1)); }, [photos.length]);

  const handleClose = useCallback(() => {
    if (ready) onClose();
  }, [ready, onClose]);

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 10000,
        background: 'rgba(0,0,0,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        touchAction: 'none',
      }}
      onClick={handleClose}
      onTouchStart={(e) => {
        touchRef.current = { x: e.touches[0].clientX, swiped: false };
      }}
      onTouchEnd={(e) => {
        const dx = e.changedTouches[0].clientX - touchRef.current.x;
        if (Math.abs(dx) > 60) {
          touchRef.current.swiped = true;
          if (dx < 0) goNext(); else goPrev();
        }
      }}
    >
      {/* Photo — tap closes (unless swiped or arrow clicked) */}
      <motion.img
        key={current}
        src={photos[current]}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        draggable={false}
        style={{
          maxWidth: 'calc(100% - 40px)',
          maxHeight: 'calc(100% - 100px)',
          objectFit: 'contain',
          display: 'block',
          borderRadius: 18,
          boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
        }}
      />

      {/* Left arrow */}
      {current > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); goPrev(); }}
          style={{
            position: 'absolute', left: 28, top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(0,0,0,0.35)', border: 'none', borderRadius: '50%',
            width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', backdropFilter: 'blur(4px)',
          }}
        >
          <ChevronLeft size={18} color="#fff" />
        </button>
      )}

      {/* Right arrow */}
      {current < photos.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); goNext(); }}
          style={{
            position: 'absolute', right: 28, top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(0,0,0,0.35)', border: 'none', borderRadius: '50%',
            width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', backdropFilter: 'blur(4px)',
          }}
        >
          <ChevronRight size={18} color="#fff" />
        </button>
      )}

      {/* Counter */}
      {photos.length > 1 && (
        <div style={{
          position: 'absolute', bottom: 28,
          background: 'rgba(255,255,255,0.18)', borderRadius: 20,
          padding: '5px 16px', fontSize: 14, color: '#fff', fontWeight: 600,
          pointerEvents: 'none', backdropFilter: 'blur(8px)',
        }}>
          {current + 1} / {photos.length}
        </div>
      )}
    </motion.div>,
    document.body,
  );
}

/* ── Carousel (in-card photo slider) ── */

function PhotoCarousel({ photos, alt }: { photos: string[]; alt: string }) {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const prev = (e: React.MouseEvent) => { e.stopPropagation(); hapticFeedback('light'); setCurrent((c) => Math.max(0, c - 1)); };
  const next = (e: React.MouseEvent) => { e.stopPropagation(); hapticFeedback('light'); setCurrent((c) => Math.min(photos.length - 1, c + 1)); };

  return (
    <>
      <div
        style={{ position: 'relative', overflow: 'hidden', height: 220, userSelect: 'none' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Images track */}
        <div style={{
          display: 'flex',
          width: `${photos.length * 100}%`,
          height: '100%',
          transform: `translateX(-${current * (100 / photos.length)}%)`,
          transition: 'transform 0.3s ease',
        }}>
          {photos.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`${alt} ${i + 1}`}
              onClick={() => {
                if (lightbox !== null) return; // guard
                hapticFeedback('light');
                setLightbox(i);
              }}
              style={{
                width: `${100 / photos.length}%`,
                height: 220,
                objectFit: 'cover',
                display: 'block',
                flexShrink: 0,
                cursor: 'zoom-in',
              }}
            />
          ))}
        </div>

        {/* Carousel arrows (hidden when lightbox open) */}
        {current > 0 && lightbox === null && (
          <button onClick={prev} style={{
            position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(0,0,0,0.35)', border: 'none', borderRadius: '50%',
            width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', backdropFilter: 'blur(4px)',
          }}>
            <ChevronLeft size={18} color="#fff" />
          </button>
        )}
        {current < photos.length - 1 && lightbox === null && (
          <button onClick={next} style={{
            position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(0,0,0,0.35)', border: 'none', borderRadius: '50%',
            width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', backdropFilter: 'blur(4px)',
          }}>
            <ChevronRight size={18} color="#fff" />
          </button>
        )}

        {/* Dot indicators */}
        {photos.length > 1 && lightbox === null && (
          <div style={{
            position: 'absolute', bottom: 8, left: 0, right: 0,
            display: 'flex', justifyContent: 'center', gap: 5,
            pointerEvents: 'none',
          }}>
            {photos.map((_, i) => (
              <div key={i} style={{
                width: i === current ? 16 : 6, height: 6, borderRadius: 3,
                background: i === current ? '#fff' : 'rgba(255,255,255,0.5)',
                transition: 'width 0.2s, background 0.2s',
              }} />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox via portal */}
      {lightbox !== null && (
        <Lightbox photos={photos} startIndex={lightbox} onClose={() => setLightbox(null)} />
      )}
    </>
  );
}

/* ── YouTube embed ── */

function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

function YouTubeEmbed({ url }: { url: string }) {
  const id = getYouTubeId(url);
  if (!id) return null;
  return (
    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 0 }}>
      <iframe
        src={`https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`}
        title="YouTube"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
      />
    </div>
  );
}

/* ── Blog feed ── */

const LIKED_KEY = 'emmanuil_liked_posts';
function getLiked(): Set<string> { try { return new Set(JSON.parse(localStorage.getItem(LIKED_KEY) || '[]')); } catch { return new Set(); } }
function setLiked(s: Set<string>) { localStorage.setItem(LIKED_KEY, JSON.stringify([...s])); }

const TAG_LABELS: Record<string, Record<BlogTag | 'all', string>> = {
  ua: { all: 'Всі', general: 'Загальне', youth: 'Молодь' },
  ru: { all: 'Все', general: 'Общее', youth: 'Молодёжь' },
  en: { all: 'All', general: 'General', youth: 'Youth' },
  nl: { all: 'Alle', general: 'Algemeen', youth: 'Jongeren' },
  es: { all: 'Todo', general: 'General', youth: 'Jóvenes' },
};

const COMMENT_LABELS: Record<string, { placeholder: string; comments: string; noComments: string }> = {
  ua: { placeholder: 'Написати коментар...', comments: 'Коментарі', noComments: 'Поки немає коментарів' },
  ru: { placeholder: 'Написать комментарий...', comments: 'Комментарии', noComments: 'Пока нет комментариев' },
  en: { placeholder: 'Write a comment...', comments: 'Comments', noComments: 'No comments yet' },
  nl: { placeholder: 'Schrijf een reactie...', comments: 'Reacties', noComments: 'Nog geen reacties' },
  es: { placeholder: 'Escribe un comentario...', comments: 'Comentarios', noComments: 'Aún no hay comentarios' },
};

function timeAgo(iso: string, lang: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return lang === 'ru' || lang === 'ua' ? 'только что' : 'just now';
  if (mins < 60) return `${mins}${lang === 'ru' || lang === 'ua' ? ' мин' : 'm'}`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}${lang === 'ru' || lang === 'ua' ? ' ч' : 'h'}`;
  const days = Math.floor(hrs / 24);
  return `${days}${lang === 'ru' || lang === 'ua' ? ' д' : 'd'}`;
}

// Merge API posts with static fallback, sort by date desc
function useAllPosts() {
  const [apiPosts, setApiPosts] = useState<any[]>([]);
  useEffect(() => {
    fetchPosts().then(posts => {
      if (posts.length > 0) setApiPosts(posts);
    });
  }, []);
  const source = apiPosts.length > 0
    ? apiPosts.map(p => ({
        id: p._id,
        date: p.date,
        tags: p.tags || ['general'],
        photos: p.photos || [],
        videos: p.videos || [],
        title: p.title,
        body: p.body,
        createdAt: p.createdAt,
      }))
    : blogPosts.map(p => ({ ...p, videos: (p as any).videos || [], createdAt: '' }));
  // Sort by date desc; tie-break by createdAt desc
  return [...source].sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    const ac = (a as any).createdAt || '';
    const bc = (b as any).createdAt || '';
    return ac < bc ? 1 : -1;
  });
}

export function BlogFeed({ title }: { title: string }) {
  const lang = useLang();
  const allPosts = useAllPosts();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [reactions, setReactions] = useState<Record<string, PostReaction>>({});
  const [liked, setLikedState] = useState<Set<string>>(() => getLiked());
  const [activeTag, setActiveTag] = useState<BlogTag | 'all'>('all');
  const [comments, setComments] = useState<Record<string, PostComment[]>>({});
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [showComments, setShowComments] = useState<string | null>(null);
  const [sendingComment, setSendingComment] = useState(false);

  useEffect(() => { fetchReactions().then(setReactions); }, []);

  const loadComments = async (postId: string) => {
    const c = await fetchComments(postId);
    setComments((prev) => ({ ...prev, [postId]: c }));
  };

  const handleToggleComments = (postId: string) => {
    hapticFeedback('light');
    if (showComments === postId) {
      setShowComments(null);
    } else {
      setShowComments(postId);
      if (!comments[postId]) loadComments(postId);
    }
  };

  const handleSendComment = async (postId: string) => {
    const text = commentText[postId]?.trim();
    if (!text || sendingComment) return;
    hapticFeedback('medium');
    setSendingComment(true);

    const tg = (window as any).Telegram?.WebApp;
    const user = tg?.initDataUnsafe?.user;
    const userId = user?.id?.toString() || 'anon';
    const name = user ? `${user.first_name}${user.last_name ? ' ' + user.last_name : ''}` : 'Guest';
    const photo = user?.photo_url;

    try {
      const comment = await addComment(postId, { userId, name, photo, text });
      setComments((prev) => ({ ...prev, [postId]: [...(prev[postId] || []), comment] }));
      setCommentText((prev) => ({ ...prev, [postId]: '' }));
    } catch { /* offline */ }
    setSendingComment(false);
  };

  const labels = TAG_LABELS[lang] ?? TAG_LABELS.ru;
  const filteredPosts = activeTag === 'all'
    ? allPosts
    : allPosts.filter((p) => p.tags.includes(activeTag));

  const handleLike = async (postId: string) => {
    hapticFeedback('light');
    const isLiked = liked.has(postId);
    const next = new Set(liked);
    isLiked ? next.delete(postId) : next.add(postId);
    setLikedState(next);
    setLiked(next);
    // Optimistic update
    setReactions((prev) => ({
      ...prev,
      [postId]: { likes: Math.max(0, (prev[postId]?.likes || 0) + (isLiked ? -1 : 1)), shares: prev[postId]?.shares || 0 },
    }));
    try { const r = await likePost(postId, isLiked ? -1 : 1); setReactions((prev) => ({ ...prev, [postId]: r })); } catch { /* offline */ }
  };

  const handleShare = async (post: typeof blogPosts[0]) => {
    hapticFeedback('light');

    const recordShare = () => {
      setReactions((prev) => ({
        ...prev,
        [post.id]: { likes: prev[post.id]?.likes || 0, shares: (prev[post.id]?.shares || 0) + 1 },
      }));
      sharePost(post.id).then((r) => setReactions((prev) => ({ ...prev, [post.id]: r }))).catch(() => {});
    };

    const tg = (window as any).Telegram?.WebApp;
    const userId = tg?.initDataUnsafe?.user?.id;

    // Send photo + caption directly to user's bot chat, then open grid picker to forward
    if (userId) {
      try {
        await sendPostToUser({
          userId,
          title: loc(post.title, lang),
          body: loc(post.body, lang),
          photoUrl: post.photos?.[0],
          lang,
        });
        // Open bot chat so user can forward the message
        tg?.openTelegramLink?.('https://t.me/myconclaw_bot');
        recordShare();
        return;
      } catch (err) {
        console.warn('[share] sendPostToUser failed:', err);
      }
    }

    // Fallback: plain link share
    shareUrl('https://t.me/myconclaw_bot/app', loc(post.title, lang));
    recordShare();
  };

  return (
    <div>
      <div className="section-header" style={{ marginBottom: 10 }}>
        <h3 className="section-title">{title}</h3>
      </div>

      {/* Tag filter pills */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, overflowX: 'auto', paddingBottom: 2 }}>
        {(['all', 'general', 'youth'] as const).map((tag) => {
          const active = activeTag === tag;
          return (
            <button
              key={tag}
              onClick={() => { hapticFeedback('light'); setActiveTag(tag); setExpanded(null); }}
              style={{
                padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: active ? 700 : 500,
                whiteSpace: 'nowrap', cursor: 'pointer', border: 'none',
                background: active ? '#C9A96E' : 'var(--bg-secondary)',
                color: active ? '#fff' : 'var(--text-secondary)',
                transition: 'all 0.15s',
              }}
            >
              {labels[tag]}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filteredPosts.map((post, idx) => {
          const isOpen = expanded === post.id;

          return (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
            >
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {post.photos && post.photos.length > 0 && (
                  <PhotoCarousel photos={post.photos} alt={loc(post.title, lang)} />
                )}

                {post.videos && post.videos.length > 0 && post.videos.map((v: string, vi: number) => (
                  <YouTubeEmbed key={vi} url={v} />
                ))}

                <div
                  style={{ padding: 14, cursor: 'pointer' }}
                  onClick={() => {
                    hapticFeedback('light');
                    setExpanded(isOpen ? null : post.id);
                  }}
                >
                  <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                    {formatDate(post.date, lang)}
                  </span>
                  <h4 style={{ fontSize: 15, fontWeight: 700, margin: '6px 0', lineHeight: 1.35 }}>
                    {loc(post.title, lang)}
                  </h4>
                  <p style={{
                    fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5,
                    display: '-webkit-box', WebkitLineClamp: isOpen ? undefined : 2,
                    WebkitBoxOrient: 'vertical', overflow: isOpen ? 'visible' : 'hidden',
                  }}>
                    {loc(post.body, lang)}
                  </p>
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                    marginTop: 10, gap: 4,
                    color: 'var(--primary)', fontSize: 12, fontWeight: 600,
                  }}>
                    {isOpen
                      ? (lang === 'ua' ? 'Згорнути' : lang === 'ru' ? 'Свернуть' : lang === 'nl' ? 'Inklappen' : lang === 'es' ? 'Cerrar' : 'Collapse')
                      : (lang === 'ua' ? 'Читати' : lang === 'ru' ? 'Читать' : lang === 'nl' ? 'Lees meer' : lang === 'es' ? 'Leer más' : 'Read more')}
                    {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </div>

                  {/* Like / Share row */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    marginTop: 12, paddingTop: 10,
                    borderTop: '1px solid var(--border-light)',
                  }} onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleLike(post.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 5,
                        padding: '5px 10px', borderRadius: 20,
                        background: liked.has(post.id) ? 'rgba(255,59,92,0.1)' : 'var(--bg-secondary)',
                        border: `1px solid ${liked.has(post.id) ? 'rgba(255,59,92,0.3)' : 'var(--border-light)'}`,
                        cursor: 'pointer', transition: 'all 0.15s',
                      }}
                    >
                      <Heart
                        size={14}
                        color={liked.has(post.id) ? '#ff3b5c' : 'var(--text-secondary)'}
                        fill={liked.has(post.id) ? '#ff3b5c' : 'none'}
                      />
                      <span style={{ fontSize: 12, fontWeight: 600, color: liked.has(post.id) ? '#ff3b5c' : 'var(--text-secondary)' }}>
                        {reactions[post.id]?.likes || 0}
                      </span>
                    </button>

                    <button
                      onClick={() => handleToggleComments(post.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 5,
                        padding: '5px 10px', borderRadius: 20,
                        background: showComments === post.id ? 'rgba(201,169,110,0.12)' : 'var(--bg-secondary)',
                        border: `1px solid ${showComments === post.id ? 'rgba(201,169,110,0.3)' : 'var(--border-light)'}`,
                        cursor: 'pointer', transition: 'all 0.15s',
                      }}
                    >
                      <MessageCircle size={14} color={showComments === post.id ? '#C9A96E' : 'var(--text-secondary)'} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: showComments === post.id ? '#C9A96E' : 'var(--text-secondary)' }}>
                        {comments[post.id]?.length || 0}
                      </span>
                    </button>

                    <button
                      onClick={() => handleShare(post)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 5,
                        padding: '5px 10px', borderRadius: 20,
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-light)',
                        cursor: 'pointer',
                      }}
                    >
                      <Share2 size={14} color="var(--text-secondary)" />
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
                        {reactions[post.id]?.shares || 0}
                      </span>
                    </button>
                  </div>

                  {/* Comments section */}
                  <AnimatePresence>
                    {showComments === post.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ overflow: 'hidden', borderTop: '1px solid var(--border-light)' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div style={{ padding: '12px 14px' }}>
                          {/* Comment input */}
                          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                            <input
                              type="text"
                              value={commentText[post.id] || ''}
                              onChange={(e) => setCommentText((prev) => ({ ...prev, [post.id]: e.target.value }))}
                              onKeyDown={(e) => { if (e.key === 'Enter') handleSendComment(post.id); }}
                              placeholder={(COMMENT_LABELS[lang] ?? COMMENT_LABELS.ru).placeholder}
                              style={{
                                flex: 1, padding: '8px 12px', borderRadius: 20, fontSize: 13,
                                background: 'var(--bg-secondary)', border: '1px solid var(--border-light)',
                                color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit',
                              }}
                            />
                            <button
                              onClick={() => handleSendComment(post.id)}
                              disabled={!commentText[post.id]?.trim() || sendingComment}
                              style={{
                                width: 36, height: 36, borderRadius: '50%', border: 'none', cursor: 'pointer',
                                background: commentText[post.id]?.trim() ? '#C9A96E' : 'var(--bg-secondary)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                opacity: sendingComment ? 0.5 : 1, transition: 'all 0.15s', flexShrink: 0,
                              }}
                            >
                              <Send size={14} color={commentText[post.id]?.trim() ? '#fff' : 'var(--text-tertiary)'} />
                            </button>
                          </div>

                          {/* Comments list */}
                          {(comments[post.id] || []).length === 0 ? (
                            <p style={{ fontSize: 12, color: 'var(--text-tertiary)', textAlign: 'center', padding: '8px 0' }}>
                              {(COMMENT_LABELS[lang] ?? COMMENT_LABELS.ru).noComments}
                            </p>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                              {(comments[post.id] || []).map((c) => (
                                <div key={c.id} style={{ display: 'flex', gap: 8 }}>
                                  <div style={{
                                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                                    background: 'rgba(201,169,110,0.15)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    overflow: 'hidden',
                                  }}>
                                    {c.photo ? (
                                      <img src={c.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                      <span style={{ fontSize: 12, fontWeight: 700, color: '#C9A96E' }}>
                                        {c.name.charAt(0).toUpperCase()}
                                      </span>
                                    )}
                                  </div>
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{c.name}</span>
                                      <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>{timeAgo(c.createdAt, lang)}</span>
                                    </div>
                                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.4, marginTop: 2 }}>{c.text}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
