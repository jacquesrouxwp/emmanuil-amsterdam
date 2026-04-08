import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

                {/* Body preview */}
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
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

                {/* Expanded content */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{
                        marginTop: 10, paddingTop: 10,
                        borderTop: '1px solid var(--border-light)',
                        fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6,
                      }}>
                        {loc(post.body, lang)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
