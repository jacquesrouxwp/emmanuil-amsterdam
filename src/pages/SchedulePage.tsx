import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, Phone, User, Users, ChevronDown, ChevronUp, Info, Navigation } from 'lucide-react';
import { services, homeGroups, typeColors } from '@/data/schedule';
import { hapticFeedback, getUserName, getTelegramUser, openLink } from '@/lib/telegram';
import { fetchAllAttendance, toggleAttendance, type GroupAttendance } from '@/lib/api';
import { useT, useLang, loc } from '@/i18n/translations';
import { useEffect, useCallback } from 'react';

export function SchedulePage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showRideInfo, setShowRideInfo] = useState(false);
  const [showAttendeesFor, setShowAttendeesFor] = useState<string | null>(null);
  const [attendance, setAttendance] = useState<Record<string, GroupAttendance>>({});
  const [myAttending, setMyAttending] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<string | null>(null);

  const t = useT();
  const lang = useLang();

  const tgUser = getTelegramUser();
  const userId = tgUser?.id?.toString() || 'guest-' + getUserName();
  const userName = tgUser?.first_name || getUserName();
  const userPhoto = tgUser?.photo_url;

  const loadAttendance = useCallback(async () => {
    try {
      const data = await fetchAllAttendance();
      setAttendance(data);
      const attending = new Set<string>();
      for (const [groupId, group] of Object.entries(data)) {
        if (group.attendees.some((a) => a.name === userName)) attending.add(groupId);
      }
      setMyAttending(attending);
    } catch { /* offline */ }
  }, [userName]);

  useEffect(() => { loadAttendance(); }, [loadAttendance]);

  const toggle = (id: string) => setExpandedId((prev) => (prev === id ? null : id));

  const handleAttend = async (e: React.MouseEvent, groupId: string) => {
    e.stopPropagation();
    hapticFeedback('medium');
    setLoading(groupId);
    try {
      const result = await toggleAttendance(groupId, userId, userName, userPhoto);
      setAttendance((prev) => ({ ...prev, [groupId]: { count: result.count, attendees: result.attendees } }));
      setMyAttending((prev) => {
        const next = new Set(prev);
        result.isAttending ? next.add(groupId) : next.delete(groupId);
        return next;
      });
    } catch {
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
        <h1 className="page-title">{t.schedule.title}</h1>
        <p className="page-subtitle">{t.schedule.subtitle}</p>
      </motion.div>

      {/* Services — side by side */}
      <div style={{ marginBottom: 20 }}>
        <h3 className="section-title" style={{ marginBottom: 10 }}>{t.schedule.services}</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          {services.map((s, i) => {
            const color = typeColors[s.type] || '#5E9ED6';
            return (
              <motion.div key={s.id} className="card" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} style={{ padding: 0, overflow: 'hidden', flex: 1, minWidth: 0 }}>
                {s.brandName && (
                  <div style={{ height: 64, background: s.brandGradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center', color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
                      {s.brandName.split('\n').map((line, li) => (
                        <div key={li} style={{ fontSize: li === 0 ? 13 : 10, fontWeight: 800, letterSpacing: li === 0 ? 2 : 1.5, lineHeight: 1.3 }}>{line}</div>
                      ))}
                    </div>
                  </div>
                )}
                <div style={{ padding: '10px 10px 12px' }}>
                  <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 5 }}>{loc(s.title, lang)}</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-secondary)' }}>
                      <Clock size={11} color={color} />{loc(s.day, lang)}, {s.time}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-secondary)' }}>
                      <MapPin size={11} color={color} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.address}</span>
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
          <h3 className="section-title">{t.schedule.homeGroups}</h3>
          <button onClick={() => { hapticFeedback('light'); setShowRideInfo(true); }} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--primary)', cursor: 'pointer', padding: '4px 8px', borderRadius: 8, background: 'var(--primary-bg)' }}>
            <Info size={14} />{t.schedule.howToGet}
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
              <motion.div key={g.id} className="card" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} style={{ padding: 0, overflow: 'hidden', borderLeft: `3px solid ${typeColors.group}`, position: 'relative' }}>
                <button onClick={(e) => count > 0 ? handleShowAttendees(e, g.id) : undefined} style={{ position: 'absolute', top: 8, right: 8, display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, cursor: count > 0 ? 'pointer' : 'default', color: count > 0 ? typeColors.group : 'var(--text-tertiary)', background: count > 0 ? `${typeColors.group}12` : 'var(--bg-secondary)', padding: '3px 8px', borderRadius: 10, zIndex: 2 }}>
                  <Users size={12} />{count}
                </button>
                <AnimatePresence>
                  {showingAttendees && attendees.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: -4, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -4, scale: 0.95 }} transition={{ duration: 0.15 }} style={{ position: 'absolute', top: 34, right: 8, background: 'var(--bg-card)', borderRadius: 10, padding: '6px 0', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', border: '1px solid var(--border-light)', zIndex: 10, minWidth: 140 }}>
                      {attendees.map((a, ai) => (
                        <div key={ai} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', fontSize: 13 }}>
                          {a.photo ? <img src={a.photo} alt="" style={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover' }} /> : <div style={{ width: 22, height: 22, borderRadius: '50%', background: `${typeColors.group}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600, color: typeColors.group }}>{a.name[0]}</div>}
                          <span style={{ fontWeight: 500 }}>{a.name}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
                <button onClick={() => toggle(g.id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '12px 14px', paddingRight: 60, textAlign: 'left', cursor: 'pointer', gap: 8 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>{g.city || 'Група'}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-secondary)' }}>
                      <Clock size={12} color={typeColors.group} />{loc(g.day, lang)}, {g.time}
                    </div>
                  </div>
                  {isOpen ? <ChevronUp size={18} color="var(--text-tertiary)" /> : <ChevronDown size={18} color="var(--text-tertiary)" />}
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} style={{ overflow: 'hidden' }}>
                      <div style={{ padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 6, borderTop: '1px solid var(--border-light)', paddingTop: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
                          <MapPin size={13} color={typeColors.group} style={{ marginTop: 2, flexShrink: 0 }} />{g.address}
                        </div>
                        {g.leader && <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}><User size={13} color={typeColors.group} />{g.leader}</div>}
                        {g.phone && <a href={`tel:${g.phone.replace(/\s/g, '')}`} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--primary)', textDecoration: 'none' }}><Phone size={13} />{g.phone}</a>}
                        <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                          {/* Google Maps */}
                          <button
                            onClick={(e) => { e.stopPropagation(); hapticFeedback('light'); openLink(`https://maps.google.com/?q=${encodeURIComponent(g.address)}`); }}
                            title="Google Maps"
                            style={{
                              width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              background: 'rgba(66,133,244,0.10)',
                              border: '1.5px solid rgba(66,133,244,0.22)',
                              cursor: 'pointer',
                            }}
                          >
                            <Navigation size={16} color="#4285F4" />
                          </button>
                          {/* Буду */}
                          <button
                            onClick={(e) => handleAttend(e, g.id)}
                            disabled={isLoading}
                            style={{
                              flex: 1, height: 40, borderRadius: 10,
                              fontSize: 14, fontWeight: 600,
                              cursor: isLoading ? 'wait' : 'pointer',
                              transition: 'all 0.2s',
                              background: isAttending ? typeColors.group : `${typeColors.group}12`,
                              color: isAttending ? '#fff' : typeColors.group,
                              border: `1.5px solid ${isAttending ? typeColors.group : `${typeColors.group}30`}`,
                              opacity: isLoading ? 0.7 : 1,
                            }}
                          >
                            {isLoading ? '...' : isAttending ? t.schedule.willAttendConfirm : t.schedule.willAttend}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Ride info — centered popup */}
      <AnimatePresence>
        {showRideInfo && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowRideInfo(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 32 }}>
            <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }} transition={{ duration: 0.18 }} onClick={(e) => e.stopPropagation()} style={{ background: 'var(--bg-card)', borderRadius: 16, padding: '18px 20px', maxWidth: 280, width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Info size={16} color="var(--primary)" />
                <span style={{ fontSize: 14, fontWeight: 700 }}>{t.schedule.howToGetTitle}</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>{t.schedule.howToGetDesc}</p>
              <button onClick={() => setShowRideInfo(false)} style={{ width: '100%', padding: '8px 0', borderRadius: 10, fontSize: 13, fontWeight: 600, background: 'var(--primary-bg)', color: 'var(--primary)', cursor: 'pointer' }}>{t.schedule.howToGetOk}</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
