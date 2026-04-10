import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { upcomingEvents } from '@/data/events';
import { useT, loc } from '@/i18n/translations';
import { hapticFeedback, openLink } from '@/lib/telegram';

export function EventsPage() {
  const t = useT();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const toggle = (id: string) => setExpandedId((prev) => (prev === id ? null : id));

  return (
    <div className="page">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="page-title">{t.events.title}</h1>
        <p className="page-subtitle">{t.events.subtitle}</p>
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {upcomingEvents.map((ev, i) => {
          const isOpen = expandedId === ev.id;
          return (
            <motion.div
              key={ev.id}
              className="card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              style={{ padding: 0, overflow: 'hidden' }}
            >
              {/* Branded header */}
              <div style={{
                height: ev.photo ? 160 : 120,
                background: ev.brandGradient || `linear-gradient(135deg, ${ev.color}25 0%, ${ev.color}08 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}>
                {ev.photo && (
                  <>
                    <img src={ev.photo} style={{
                      position: 'absolute', inset: 0,
                      width: '100%', height: '100%',
                      objectFit: 'cover', zIndex: 0,
                    }} />
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'rgba(10,10,15,0.45)',
                      zIndex: 1,
                    }} />
                  </>
                )}
                {ev.brandName ? (
                  <div style={{
                    textAlign: 'center',
                    color: '#fff',
                    textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                    position: 'relative',
                    zIndex: 2,
                  }}>
                    {loc(ev.brandName, t.lang).split('\n').map((line, li) => (
                      <div key={li} style={{
                        fontSize: li === 0 ? 22 : 18,
                        fontWeight: 800,
                        letterSpacing: li === 0 ? 4 : 2,
                        lineHeight: 1.3,
                      }}>
                        {line}
                      </div>
                    ))}
                  </div>
                ) : (
                  <Calendar size={36} color={ev.color} style={{ opacity: 0.4 }} />
                )}
              </div>

              {/* Content */}
              <div style={{ padding: 16 }}>
                <span className="badge" style={{ background: `${ev.color}18`, color: ev.color, marginBottom: 8 }}>
                  {loc(ev.badge, t.lang)}
                </span>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>{loc(ev.title, t.lang)}</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
                    <Calendar size={14} color={ev.color} />
                    {loc(ev.date, t.lang)}{ev.time ? `, ${ev.time}` : ''}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
                    <MapPin size={14} color={ev.color} />
                    {ev.address}
                  </div>
                </div>

                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 10 }}>
                  {loc(ev.shortDesc, t.lang)}
                </p>

                <button
                  onClick={() => toggle(ev.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: 13,
                    fontWeight: 600,
                    color: ev.color,
                    cursor: 'pointer',
                  }}
                >
                  {isOpen ? t.events.collapse : t.events.details}
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{
                        marginTop: 10,
                        paddingTop: 10,
                        borderTop: '1px solid var(--border-light)',
                      }}>
                        <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.7 }}>
                          {loc(ev.fullDesc, t.lang)}
                        </p>
                        {ev.link && (
                          <button
                            onClick={() => { hapticFeedback('light'); openLink(ev.link!); }}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 6,
                              marginTop: 12, padding: '10px 16px',
                              borderRadius: 12, fontSize: 14, fontWeight: 600,
                              background: `${ev.color}15`, color: ev.color,
                              border: `1.5px solid ${ev.color}30`,
                              cursor: 'pointer', width: '100%', justifyContent: 'center',
                            }}
                          >
                            <ExternalLink size={16} />
                            {t.lang === 'ua' ? 'Відкрити сайт' : t.lang === 'ru' ? 'Открыть сайт' : 'Visit website'}
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>

      {upcomingEvents.length === 0 && (
        <div className="empty-state">
          <p>{t.events.empty}</p>
        </div>
      )}
    </div>
  );
}
