import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, Phone, User, Users, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { services, homeGroups, typeColors } from '@/data/schedule';
import { hapticFeedback, getUserName, getTelegramUser } from '@/lib/telegram';
import { fetchAllAttendance, toggleAttendance, type GroupAttendance } from '@/lib/api';

export function SchedulePage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showRideInfo, setShowRideInfo] = useState(false);
  const [showAttendeesFor, setShowAttendeesFor] = useState<string | null>(null);

  // Server-driven attendance state
  const [attendance, setAttendance] = useState<Record<string, GroupAttendance>>({});
  const [myAttending, setMyAttending] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<string | null>(null);

  const tgUser = getTelegramUser();
  const userId = tgUser?.id?.toString() || 'guest-' + getUserName();
  const userName = tgUser?.first_name || getUserName();
  const userPhoto = tgUser?.photo_url;

  const loadAttendance = useCallback(async () => {
    try {
      const data = await fetchAllAttendance();
      setAttendance(data);
      // Figure out which groups current user is attending
      const attending = new Set<string>();
      for (const [groupId, group] of Object.entries(data)) {
        if (group.attendees.some((a) => a.name === userName)) {
          attending.add(groupId);
        }
      }
      setMyAttending(attending);
    } catch {
      // Offline — keep local state
    }
  }, [userName]);

  useEffect(() => {
    loadAttendance();
  }, [loadAttendance]);

  const toggle = (id: string) => setExpandedId((prev) => (prev === id ? null : id));

  const handleAttend = async (e: React.MouseEvent, groupId: string) => {
    e.stopPropagation();
    hapticFeedback('medium');
    setLoading(groupId);
    try {
      const result = await toggleAttendance(groupId, userId, userName, userPhoto);
      setAttendance((prev) => ({
        ...prev,
        [groupId]: { count: result.count, attendees: result.attendees },
      }));
      setMyAttending((prev) => {
        const next = new Set(prev);
        result.isAttending ? next.add(groupId) : next.delete(groupId);
        return next;
      });
    } catch {
      // Offline fallback — toggle locally
      setMyAttending((prev) => {
        const next = new Set(prev);
        next.has(groupId) ? next.delete(groupId) : next.add(groupId);
        return next;
      });
    }
    setLoading(null);
  };

  const handleShowAttendees = (e: React.MouseEvent, groupId: string) => {
    e.stopPropagation();
    hapticFeedback('light');
    setShowAttendeesFor((prev) => (prev === groupId ? null : groupId));
  };

  return (
    <div className="page">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="page-title">Розклад</h1>
        <p className="page-subtitle">Служіння та домашні групи</p>
      </motion.div>

      {/* Services — side by side */}
      <div style={{ marginBottom: 20 }}>
        <h3 className="section-title" style={{ marginBottom: 10 }}>Служіння</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          {services.map((s, i) => {
            const color = typeColors[s.type] || '#5E9ED6';
            return (
              <motion.div
                key={s.id}
                className="card"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{ padding: 0, overflow: 'hidden', flex: 1, minWidth: 0 }}
              >
                {s.brandName && (
                  <div style={{
                    height: 64,
                    background: s.brandGradient || `linear-gradient(135deg, ${color}40, ${color}10)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <div style={{ textAlign: 'center', color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
                      {s.brandName.split('\n').map((line, li) => (
                        <div key={li} style={{
                          fontSize: li === 0 ? 13 : 10,
                          fontWeight: 800,
                          letterSpacing: li === 0 ? 2 : 1.5,
                          lineHeight: 1.3,
                        }}>
                          {line}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div style={{ padding: '10px 10px 12px' }}>
                  <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 5 }}>{s.title}</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-secondary)' }}>
                      <Clock size={11} color={color} />
                      {s.day}, {s.time}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-secondary)' }}>
                      <MapPin size={11} color={color} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {s.address}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Home Groups */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <h3 className="section-title">Домашні групи</h3>
          <button
            onClick={() => { hapticFeedback('light'); setShowRideInfo(true); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              fontSize: 12, color: 'var(--primary)', cursor: 'pointer',
              padding: '4px 8px', borderRadius: 8,
              background: 'var(--primary-bg)',
            }}
          >
            <Info size={14} />
            Як дістатися?
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {homeGroups.map((g, i) => {
            const isOpen = expandedId === g.id;
            const isAttending = myAttending.has(g.id);
            const groupData = attendance[g.id];
            const count = groupData?.count || 0;
            const attendees = groupData?.attendees || [];
            const showingAttendees = showAttendeesFor === g.id;
            const isLoading = loading === g.id;
            return (
              <motion.div
                key={g.id}
                className="card"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                style={{ padding: 0, overflow: 'hidden', borderLeft: `3px solid ${typeColors.group}`, position: 'relative' }}
              >
                {/* Attendance counter badge — clickable */}
                <button
                  onClick={(e) => count > 0 ? handleShowAttendees(e, g.id) : undefined}
                  style={{
                    position: 'absolute', top: 8, right: 8,
                    display: 'flex', alignItems: 'center', gap: 3,
                    fontSize: 12, cursor: count > 0 ? 'pointer' : 'default',
                    color: count > 0 ? typeColors.group : 'var(--text-tertiary)',
                    background: count > 0 ? `${typeColors.group}12` : 'var(--bg-secondary)',
                    padding: '3px 8px', borderRadius: 10,
                    zIndex: 2,
                  }}
                >
                  <Users size={12} />
                  {count}
                </button>

                {/* Attendees popup */}
                <AnimatePresence>
                  {showingAttendees && attendees.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -4, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      style={{
                        position: 'absolute', top: 34, right: 8,
                        background: 'var(--bg-card)',
                        borderRadius: 10,
                        padding: '6px 0',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                        border: '1px solid var(--border-light)',
                        zIndex: 10,
                        minWidth: 140,
                      }}
                    >
                      {attendees.map((a, ai) => (
                        <div
                          key={ai}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            padding: '6px 12px',
                            fontSize: 13,
                          }}
                        >
                          {a.photo ? (
                            <img
                              src={a.photo}
                              alt=""
                              style={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover' }}
                            />
                          ) : (
                            <div style={{
                              width: 22, height: 22, borderRadius: '50%',
                              background: `${typeColors.group}20`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 10, fontWeight: 600, color: typeColors.group,
                            }}>
                              {a.name[0]}
                            </div>
                          )}
                          <span style={{ fontWeight: 500 }}>{a.name}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  onClick={() => toggle(g.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '12px 14px',
                    paddingRight: 60,
                    textAlign: 'left',
                    cursor: 'pointer',
                    gap: 8,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>
                      {g.city || 'Група'}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-secondary)' }}>
                      <Clock size={12} color={typeColors.group} />
                      {g.day}, {g.time}
                    </div>
                  </div>
                  {isOpen ? (
                    <ChevronUp size={18} color="var(--text-tertiary)" />
                  ) : (
                    <ChevronDown size={18} color="var(--text-tertiary)" />
                  )}
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
                        padding: '0 14px 14px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 6,
                        borderTop: '1px solid var(--border-light)',
                        paddingTop: 10,
                      }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
                          <MapPin size={13} color={typeColors.group} style={{ marginTop: 2, flexShrink: 0 }} />
                          {g.address}
                        </div>
                        {g.leader && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
                            <User size={13} color={typeColors.group} />
                            {g.leader}
                          </div>
                        )}
                        {g.phone && (
                          <a
                            href={`tel:${g.phone.replace(/\s/g, '')}`}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                              fontSize: 13,
                              color: 'var(--primary)',
                              textDecoration: 'none',
                            }}
                          >
                            <Phone size={13} />
                            {g.phone}
                          </a>
                        )}

                        {/* "Буду" button */}
                        <button
                          onClick={(e) => handleAttend(e, g.id)}
                          disabled={isLoading}
                          style={{
                            marginTop: 6,
                            padding: '8px 0',
                            borderRadius: 10,
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: isLoading ? 'wait' : 'pointer',
                            transition: 'all 0.2s',
                            background: isAttending ? typeColors.group : `${typeColors.group}12`,
                            color: isAttending ? '#fff' : typeColors.group,
                            border: `1.5px solid ${isAttending ? typeColors.group : `${typeColors.group}30`}`,
                            opacity: isLoading ? 0.7 : 1,
                          }}
                        >
                          {isLoading ? '...' : isAttending ? '✓ Буду!' : 'Буду'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Ride info — compact bottom sheet */}
      <AnimatePresence>
        {showRideInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowRideInfo(false)}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.3)',
              display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
              zIndex: 1000,
            }}
          >
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'var(--bg-card)',
                borderRadius: '16px 16px 0 0',
                padding: '20px 20px 28px',
                maxWidth: 480,
                width: '100%',
              }}
            >
              <div style={{
                width: 36, height: 4, borderRadius: 2,
                background: 'var(--border-light)',
                margin: '0 auto 14px',
              }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <Info size={18} color="var(--primary)" />
                <h3 style={{ fontSize: 15, fontWeight: 700 }}>Як дістатися?</h3>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Якщо ви хочете приїхати, але вам нічим — напишіть одному з учасників
                або в загальній групі в Telegram, чи не буде у них місця в авто!
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
