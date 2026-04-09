import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
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

function PhotoCarousel({ photos, alt }: { photos: string[]; alt: string }) {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  if (photos.length === 1) {
    return (
      <img
        src={photos[0]}
        alt={alt}
        style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block' }}
      />
    );
  }

  const prev = () => setCurrent((c) => Math.max(0, c - 1));
  const next = () => setCurrent((c) => Math.min(photos.length - 1, c + 1));

  return (
    <div
      style={{ position: 'relative', overflow: 'hidden', height: 220, userSelect: 'none' }}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
      }}
      onTouchEnd={(e) => {
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        const dy = e.changedTouches[0].clientY - touchStartY.current;
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
          e.stopPropagation();
          if (dx < 0) next(); else prev();
        }
      }}
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
            style={{
              width: `${100 / photos.length}%`,
              height: 220,
              objectFit: 'cover',
              display: 'block',
              flexShrink: 0,
            }}
          />
        ))}
      </div>

      {/* Dot indicators */}
      <div style={{
        position: 'absolute', bottom: 8, left: 0, right: 0,
        display: 'flex', justifyContent: 'center', gap: 5,
        pointerEvents: 'none',
      }}>
        {photos.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === current ? 16 : 6,
              height: 6,
              borderRadius: 3,
              background: i === current ? '#fff' : 'rgba(255,255,255,0.5)',
              transition: 'width 0.2s, background 0.2s',
            }}
          />
        ))}
      </div>
    </div>
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
