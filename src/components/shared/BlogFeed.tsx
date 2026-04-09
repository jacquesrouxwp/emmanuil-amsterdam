import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { blogPosts } from '@/data/blog';
import { useLang, loc } from '@/i18n/translations';
import { hapticFeedback } from '@/lib/telegram';

function formatDate(iso: string, lang: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(
    lang === 'ua' ? 'uk-UA' : lang === 'ru' ? 'ru-RU' : 'en-GB',
    { day: 'numeric', month: 'long', year: 'numeric' }
  );
}

/* ── Lightbox (rendered via portal to body) ── */

function Lightbox({ photos, startIndex, onClose }: { photos: string[]; startIndex: number; onClose: () => void }) {
  const [current, setCurrent] = useState(startIndex);
  const [entered, setEntered] = useState(false);
  const touchX = useRef(0);

  // Block body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    // Small delay before accepting interactions (prevents ghost taps)
    const t = setTimeout(() => setEntered(true), 100);
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

  if (!entered) {
    // Render invisible overlay during the 100ms guard
    return createPortal(
      <div style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(0,0,0,0.45)' }} />,
      document.body,
    );
  }

  return createPortal(
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 10000,
        background: 'rgba(0,0,0,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        touchAction: 'none',
      }}
      // Prevent any click/touch from leaking through
      onClick={(e) => e.stopPropagation()}
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 60) {
          if (dx < 0) goNext(); else goPrev();
        }
      }}
    >
      {/* Close button */}
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        style={{
          position: 'absolute', top: 14, right: 14, zIndex: 10,
          background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%',
          width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', backdropFilter: 'blur(8px)',
        }}
      >
        <X size={20} color="#fff" />
      </button>

      {/* Photo */}
      <img
        src={photos[current]}
        style={{
          maxWidth: 'calc(100% - 32px)',
          maxHeight: 'calc(100% - 100px)',
          objectFit: 'contain',
          display: 'block',
          borderRadius: 18,
          boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
          transition: 'opacity 0.2s',
        }}
        draggable={false}
      />

      {/* Left arrow */}
      {current > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); goPrev(); }}
          style={{
            position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%',
            width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', backdropFilter: 'blur(8px)',
          }}
        >
          <ChevronLeft size={22} color="#fff" />
        </button>
      )}

      {/* Right arrow */}
      {current < photos.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); goNext(); }}
          style={{
            position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%',
            width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', backdropFilter: 'blur(8px)',
          }}
        >
          <ChevronRight size={22} color="#fff" />
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
    </div>,
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

/* ── Blog feed ── */

export function BlogFeed({ title }: { title: string }) {
  const lang = useLang();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div>
      <div className="section-header" style={{ marginBottom: 12 }}>
        <h3 className="section-title">{title}</h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {blogPosts.map((post, idx) => {
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
                      ? (lang === 'ua' ? 'Згорнути' : lang === 'ru' ? 'Свернуть' : 'Collapse')
                      : (lang === 'ua' ? 'Читати' : lang === 'ru' ? 'Читать' : 'Read more')}
                    {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
