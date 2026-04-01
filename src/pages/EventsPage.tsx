import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { upcomingEvents } from '@/data/events';

export function EventsPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggle = (id: string) => setExpandedId((prev) => (prev === id ? null : id));

  return (
    <div className="page">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="page-title">Важливі події</h1>
        <p className="page-subtitle">Найближчі заходи церкви</p>
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
                height: 120,
                background: ev.brandGradient || `linear-gradient(135deg, ${ev.color}25 0%, ${ev.color}08 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}>
                {ev.brandName ? (
                  <div style={{
                    textAlign: 'center',
                    color: '#fff',
                    textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  }}>
                    {ev.brandName.split('\n').map((line, li) => (
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
                  {ev.badge}
                </span>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>{ev.title}</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
                    <Calendar size={14} color={ev.color} />
                    {ev.date}{ev.time ? `, ${ev.time}` : ''}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
                    <MapPin size={14} color={ev.color} />
                    {ev.address}
                  </div>
                </div>

                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 10 }}>
                  {ev.shortDesc}
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
                  {isOpen ? 'Згорнути' : 'Детальніше'}
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
                          {ev.fullDesc}
                        </p>
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
          <p>Поки що немає запланованих подій</p>
        </div>
      )}
    </div>
  );
}
