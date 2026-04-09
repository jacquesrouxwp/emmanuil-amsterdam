import { useState, useRef, useEffect } from 'react';
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

function Lightbox({ photos, startIndex, onClose }: { photos: string[]; startIndex: number; onClose: () => void }) {
  const [current, setCurrent] = useState(startIndex);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const prev = (e: React.MouseEvent) => { e.stopPropagation(); hapticFeedback('light'); setCurrent((c) => Math.max(0, c - 1)); };
  const next = (e: React.MouseEvent) => { e.stopPropagation(); hapticFeedback('light'); setCurrent((c) => Math.min(photos.length - 1, c + 1)); };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.92)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute', top: 16, right: 16,
          background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: '50%',
          width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', zIndex: 1,
        }}
      >
        <X size={18} color="#fff" />
      </button>

      {/* Image */}
      <motion.img
        key={current}
        src={photos[current]}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.18 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '100%', maxHeight: '85vh',
          objectFit: 'contain', borderRadius: 8,
          boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
        }}
      />

      {/* Left arrow */}
      {current > 0 && (
        <button onClick={prev} style={{
          position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
          background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%',
          width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}>
          <ChevronLeft size={22} color="#fff" />
        </button>
      )}

      {/* Right arrow */}
      {current < photos.length - 1 && (
        <button onClick={next} style={{
          position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
          background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%',
          width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}>
          <ChevronRight size={22} color="#fff" />
        </button>
      )}

      {/* Counter */}
      {photos.length > 1 && (
        <div style={{
          position: 'absolute', bottom: 20,
          background: 'rgba(255,255,255,0.15)', borderRadius: 20,
          padding: '4px 12px', fontSize: 13, color: '#fff',
        }}>
          {current + 1} / {photos.length}
        </div>
      )}
    </motion.div>
  );
}

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
        {/* Images */}
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
              onClick={() => { hapticFeedback('light'); setLightbox(i); }}
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

        {/* Left arrow */}
        {current > 0 && (
          <button onClick={prev} style={{
            position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(0,0,0,0.35)', border: 'none', borderRadius: '50%',
            width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', backdropFilter: 'blur(4px)',
          }}>
            <ChevronLeft size={18} color="#fff" />
          </button>
        )}

        {/* Right arrow */}
        {current < photos.length - 1 && (
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
        {photos.length > 1 && (
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

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <Lightbox photos={photos} startIndex={lightbox} onClose={() => setLightbox(null)} />
        )}
      </AnimatePresence>
    </>
  );
}

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
              <div
                className="card"
                style={{ padding: 0, overflow: 'hidden' }}
              >
                {/* Photos */}
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
                  {/* Date */}
                  <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                    {formatDate(post.date, lang)}
                  </span>

                  {/* Title */}
                  <h4 style={{ fontSize: 15, fontWeight: 700, margin: '6px 0', lineHeight: 1.35 }}>
                    {loc(post.title, lang)}
                  </h4>

                  {/* Body */}
                  <p style={{
                    fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5,
                    display: '-webkit-box', WebkitLineClamp: isOpen ? undefined : 2,
                    WebkitBoxOrient: 'vertical', overflow: isOpen ? 'visible' : 'hidden',
                  }}>
                    {loc(post.body, lang)}
                  </p>

                  {/* Expand toggle */}
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
