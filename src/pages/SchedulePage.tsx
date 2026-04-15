import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, Phone, User, Users, Info, Navigation, Share2 } from 'lucide-react';
import { services, homeGroups, prayerMeetings, typeColors } from '@/data/schedule';
import { hapticFeedback, getUserName, getTelegramUser, openLink, shareUrl } from '@/lib/telegram';
import { fetchAllAttendance, toggleAttendance, type GroupAttendance } from '@/lib/api';
import { useT, useLang, loc } from '@/i18n/translations';

/* ── Group Detail Modal (portal, lightbox style) ── */

function GroupModal({
  group, attendance: groupData, isAttending, isLoading,
  onClose, onAttend, onShowAttendees,
}: {
  group: typeof homeGroups[0];
  attendance?: GroupAttendance;
  isAttending: boolean;
  isLoading: boolean;
  onClose: () => void;
  onAttend: (e: React.MouseEvent) => void;
  onShowAttendees: (e: React.MouseEvent) => void;
}) {
  const lang = useLang();
  const t = useT();
  const count = groupData?.count || 0;
  const attendees = groupData?.attendees || [];
  const [showAttendees, setShowAttendees] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 10000,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.88, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.88, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg-card)',
          borderRadius: 20,
          width: '100%',
          maxWidth: 340,
          overflow: 'hidden',
          boxShadow: '0 12px 48px rgba(0,0,0,0.3)',
          position: 'relative',
        }}
      >
        {/* Full-window photo background */}
        {group.photo && (
          <>
            <img
              src={group.photo}
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'cover',
                zIndex: 0,
              }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(10, 10, 15, 0.52)',
              zIndex: 1,
            }} />
          </>
        )}

        {/* Header */}
        <div style={{ position: 'relative', zIndex: 2, overflow: 'hidden' }}>
          {!group.photo && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(135deg, #4a2d7a 0%, #7c4dff 100%)',
            }} />
          )}
          <div style={{ position: 'relative', padding: '20px 18px 16px' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
              {group.city || 'Група'}
            </h3>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>
              {loc(group.title, lang)}
            </p>

            {/* Attendee badge */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (count > 0) setShowAttendees(!showAttendees);
              }}
              style={{
                position: 'absolute', top: 16, right: 16,
                display: 'flex', alignItems: 'center', gap: 4,
                fontSize: 13, fontWeight: 600, color: '#fff',
                background: 'rgba(255,255,255,0.2)', padding: '4px 10px',
                borderRadius: 12, cursor: count > 0 ? 'pointer' : 'default',
                backdropFilter: 'blur(4px)', border: 'none',
              }}
            >
              <Users size={14} />{count}
            </button>
          </div>
        </div>

        {/* Attendees dropdown */}
        <AnimatePresence>
          {showAttendees && attendees.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ overflow: 'hidden', background: 'rgba(255,255,255,0.08)', position: 'relative', zIndex: 2 }}
            >
              <div style={{ padding: '8px 18px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {attendees.map((a, ai) => (
                  <div key={ai} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, background: 'rgba(255,255,255,0.15)', padding: '4px 10px', borderRadius: 10 }}>
                    {a.photo
                      ? <img src={a.photo} alt="" style={{ width: 20, height: 20, borderRadius: '50%', objectFit: 'cover' }} />
                      : <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#fff' }}>{a.name[0]}</div>
                    }
                    <span style={{ fontWeight: 500, color: group.photo ? '#fff' : undefined }}>{a.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Details */}
        <div style={{
          padding: '16px 18px',
          display: 'flex', flexDirection: 'column', gap: 12,
          position: 'relative', zIndex: 2,
        }}>
          {/* Day & Time */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: group.photo ? '#fff' : undefined }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: group.photo ? 'rgba(255,255,255,0.15)' : `${typeColors.group}12`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Clock size={16} color={group.photo ? '#fff' : typeColors.group} />
            </div>
            <span>{loc(group.day, lang)}, {group.time}</span>
          </div>

          {/* Address */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 14, color: group.photo ? '#fff' : undefined }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: group.photo ? 'rgba(255,255,255,0.15)' : `${typeColors.group}12`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <MapPin size={16} color={group.photo ? '#fff' : typeColors.group} />
            </div>
            <span style={{ lineHeight: 1.4, paddingTop: 6 }}>{group.address}</span>
          </div>

          {/* Leader */}
          {group.leader && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: group.photo ? '#fff' : undefined }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: group.photo ? 'rgba(255,255,255,0.15)' : `${typeColors.group}12`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <User size={16} color={group.photo ? '#fff' : typeColors.group} />
              </div>
              <span>{group.leader}</span>
            </div>
          )}

          {/* Phone */}
          {group.phone && (
            <a
              href={`tel:${group.phone.replace(/\s/g, '')}`}
              onClick={(e) => e.stopPropagation()}
              style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: group.photo ? '#a8d8ff' : 'var(--primary)', textDecoration: 'none' }}
            >
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: group.photo ? 'rgba(255,255,255,0.15)' : 'rgba(94,158,214,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Phone size={16} color={group.photo ? '#a8d8ff' : 'var(--primary)'} />
              </div>
              <span>{group.phone}</span>
            </a>
          )}

          {/* Description */}
          {group.description && (
            <div style={{
              fontSize: 13, lineHeight: 1.6,
              color: group.photo ? 'rgba(255,255,255,0.85)' : 'var(--text-secondary)',
              background: group.photo ? 'rgba(255,255,255,0.1)' : 'var(--bg-secondary)',
              borderRadius: 10, padding: '10px 12px',
            }}>
              {loc(group.description, lang)}
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <button
              onClick={onAttend}
              disabled={isLoading}
              style={{
                flex: 1, height: 44, borderRadius: 12,
                fontSize: 15, fontWeight: 600,
                cursor: isLoading ? 'wait' : 'pointer',
                transition: 'all 0.2s',
                background: isAttending ? typeColors.group : (group.photo ? 'rgba(255,255,255,0.18)' : `${typeColors.group}12`),
                color: isAttending ? '#fff' : (group.photo ? '#fff' : typeColors.group),
                border: `1.5px solid ${isAttending ? typeColors.group : (group.photo ? 'rgba(255,255,255,0.25)' : `${typeColors.group}30`)}`,
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? '...' : isAttending ? t.schedule.willAttendConfirm : t.schedule.willAttend}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                hapticFeedback('light');
                const city = group.city || 'Amsterdam';
                const day = loc(group.day, lang);
                const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(group.address)}`;
                const phoneLine = group.phone ? (lang === 'ua' ? `📞 Відповідальний: ${group.phone}` : lang === 'ru' ? `📞 Ответственный: ${group.phone}` : `📞 Contact: ${group.phone}`) : '';
                const text = lang === 'ua'
                  ? `Привіт! Запрошую тебе на домашню групу в ${city} 🏠\n\n📍 Адреса: ${group.address}\n🗓 Коли: ${day}, ${group.time}${phoneLine ? '\n' + phoneLine : ''}\n\n🗺 Google Maps: ${mapsUrl}\n\nБудемо раді тебе бачити! 🙌`
                  : lang === 'ru'
                  ? `Привет! Приглашаю тебя на домашнюю группу в ${city} 🏠\n\n📍 Адрес: ${group.address}\n🗓 Когда: ${day}, ${group.time}${phoneLine ? '\n' + phoneLine : ''}\n\n🗺 Google Maps: ${mapsUrl}\n\nБудем рады тебя видеть! 🙌`
                  : lang === 'nl'
                  ? `Hoi! Ik nodig je uit voor een huisgroep in ${city} 🏠\n\n📍 Adres: ${group.address}\n🗓 Wanneer: ${day}, ${group.time}${phoneLine ? '\n' + phoneLine : ''}\n\n🗺 Google Maps: ${mapsUrl}\n\nWe zien je graag! 🙌`
                  : lang === 'es'
                  ? `¡Hola! Te invito a un grupo familiar en ${city} 🏠\n\n📍 Dirección: ${group.address}\n🗓 Cuándo: ${day}, ${group.time}${phoneLine ? '\n' + phoneLine : ''}\n\n🗺 Google Maps: ${mapsUrl}\n\n¡Nos encantaría verte! 🙌`
                  : `Hi! You're invited to a home group in ${city} 🏠\n\n📍 Address: ${group.address}\n🗓 When: ${day}, ${group.time}${phoneLine ? '\n' + phoneLine : ''}\n\n🗺 Google Maps: ${mapsUrl}\n\nWe'd love to see you! 🙌`;
                shareUrl('https://t.me/myconclaw_bot/app', text);
              }}
              style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: group.photo ? 'rgba(255,255,255,0.18)' : `${typeColors.group}12`,
                border: `1.5px solid ${group.photo ? 'rgba(255,255,255,0.25)' : `${typeColors.group}30`}`,
                cursor: 'pointer',
              }}
            >
              <Share2 size={18} color={group.photo ? '#fff' : typeColors.group} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                hapticFeedback('light');
                openLink(`https://maps.google.com/?q=${encodeURIComponent(group.address)}`);
              }}
              style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: group.photo ? 'rgba(255,255,255,0.18)' : 'rgba(66,133,244,0.10)',
                border: `1.5px solid ${group.photo ? 'rgba(255,255,255,0.25)' : 'rgba(66,133,244,0.25)'}`,
                cursor: 'pointer',
              }}
            >
              <Navigation size={18} color={group.photo ? '#fff' : '#4285F4'} />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}

/* ── Schedule Page ── */

export function SchedulePage() {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [showRideInfo, setShowRideInfo] = useState(false);
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

  return (
    <div className="page">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="page-title">{t.schedule.title}</h1>
        <p className="page-subtitle">{t.schedule.subtitle}</p>
      </motion.div>

      {/* Services — side by side */}
      <div style={{ marginBottom: 20 }}>
        <h3 className="section-title" style={{ marginBottom: 10 }}>{t.schedule.services}</h3>
        <div style={{ display: 'flex', gap: 6 }}>
          {services.map((s, i) => {
            const color = typeColors[s.type] || '#5E9ED6';
            return (
              <motion.div key={s.id} className="card" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} style={{ padding: 0, overflow: 'hidden', flex: 1, minWidth: 0 }}>
                {s.brandName && (
                  <div style={{ height: 50, background: s.brandGradient, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <div style={{ textAlign: 'center', color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
                      {s.brandName.split('\n').map((line, li) => (
                        <div key={li} style={{ fontSize: li === 0 ? 11 : 9, fontWeight: 800, letterSpacing: li === 0 ? 1.5 : 1, lineHeight: 1.3 }}>{line}</div>
                      ))}
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); hapticFeedback('light'); openLink(`https://maps.google.com/?q=${encodeURIComponent(s.address)}`); }}
                      style={{
                        position: 'absolute', top: 5, right: 5,
                        width: 22, height: 22, borderRadius: 6,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(255,255,255,0.18)',
                        border: '1px solid rgba(255,255,255,0.28)',
                        cursor: 'pointer',
                        backdropFilter: 'blur(4px)',
                      }}
                    >
                      <Navigation size={10} color="#fff" />
                    </button>
                  </div>
                )}
                <div style={{ padding: '8px 8px 10px' }}>
                  <h4 style={{ fontSize: 11, fontWeight: 600, marginBottom: 4, lineHeight: 1.25 }}>{loc(s.title, lang)}</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: 'var(--text-secondary)' }}>
                      <Clock size={9} color={color} />{loc(s.day, lang)}, {s.time}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: 'var(--text-secondary)' }}>
                      <MapPin size={9} color={color} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.address}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Home Groups — 2-column grid */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <h3 className="section-title">{t.schedule.homeGroups}</h3>
          <button onClick={() => { hapticFeedback('light'); setShowRideInfo(true); }} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--primary)', cursor: 'pointer', padding: '4px 8px', borderRadius: 8, background: 'var(--primary-bg)' }}>
            <Info size={14} />{t.schedule.howToGet}
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 8,
        }}>
          {homeGroups.map((g, i) => {
            const count = attendance[g.id]?.count || 0;
            const isAttending = myAttending.has(g.id);

            return (
              <motion.div
                key={g.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <button
                  className="card"
                  onClick={() => { hapticFeedback('light'); setSelectedGroup(g.id); }}
                  style={{
                    padding: 0, overflow: 'hidden', width: '100%',
                    textAlign: 'left', cursor: 'pointer',
                    borderTop: g.photo ? 'none' : `3px solid ${typeColors.group}`,
                    transition: 'transform 0.15s',
                    position: 'relative',
                  }}
                >
                  {/* Full card photo background */}
                  {g.photo && (
                    <>
                      <img src={g.photo} style={{
                        position: 'absolute', inset: 0,
                        width: '100%', height: '100%',
                        objectFit: 'cover', zIndex: 0,
                      }} />
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'rgba(10,10,15,0.55)',
                        zIndex: 1,
                      }} />
                    </>
                  )}

                  <div style={{ padding: '12px 10px', position: 'relative', zIndex: 2 }}>
                    {/* City name */}
                    <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 6, color: g.photo ? '#fff' : undefined }}>
                      {g.city || 'Група'}
                    </h4>

                    {/* Day & time */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: g.photo ? 'rgba(255,255,255,0.8)' : 'var(--text-secondary)', marginBottom: 4 }}>
                      <Clock size={11} color={g.photo ? 'rgba(255,255,255,0.8)' : typeColors.group} />
                      {loc(g.day, lang)}, {g.time}
                    </div>

                    {/* Leader */}
                    {g.leader && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: g.photo ? 'rgba(255,255,255,0.8)' : 'var(--text-secondary)', marginBottom: 6 }}>
                        <User size={11} color={g.photo ? 'rgba(255,255,255,0.8)' : typeColors.group} />
                        {g.leader}
                      </div>
                    )}

                    {/* Bottom row: attendees + attending badge */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 3,
                        fontSize: 11,
                        color: g.photo ? '#fff' : (count > 0 ? typeColors.group : 'var(--text-tertiary)'),
                        background: g.photo ? 'rgba(255,255,255,0.18)' : (count > 0 ? `${typeColors.group}12` : 'var(--bg-secondary)'),
                        padding: '2px 7px', borderRadius: 8,
                      }}>
                        <Users size={11} />{count}
                      </div>
                      {isAttending && (
                        <div style={{
                          fontSize: 10, fontWeight: 600,
                          color: g.photo ? '#fff' : typeColors.group,
                          background: g.photo ? 'rgba(255,255,255,0.2)' : `${typeColors.group}15`,
                          padding: '2px 7px', borderRadius: 8,
                        }}>
                          ✓
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Prayer Ministry — same card format as home groups */}
      <div style={{ marginTop: 20 }}>
        <h3 className="section-title" style={{ marginBottom: 10 }}>{t.schedule.prayerMinistry}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {prayerMeetings.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <div
                className="card"
                style={{
                  padding: 0, overflow: 'hidden', width: '100%',
                  background: s.brandGradient || 'linear-gradient(135deg, #0a0a1a 0%, #2d2d6b 100%)',
                  position: 'relative',
                  borderTop: 'none',
                }}
              >
                <div style={{ padding: '12px 10px', position: 'relative', zIndex: 2 }}>
                  {/* Brand name */}
                  {s.brandName && (
                    <div style={{ marginBottom: 6 }}>
                      {s.brandName.split('\n').map((line, li) => (
                        <div key={li} style={{
                          fontSize: li === 0 ? 11 : 9, fontWeight: 800,
                          letterSpacing: li === 0 ? 1.5 : 1, lineHeight: 1.3,
                          color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                        }}>{line}</div>
                      ))}
                    </div>
                  )}
                  {/* Title */}
                  <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 6, color: '#fff' }}>
                    {loc(s.title, lang)}
                  </h4>
                  {/* Day & time */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'rgba(255,255,255,0.75)', marginBottom: 4 }}>
                    <Clock size={11} color="rgba(255,255,255,0.75)" />
                    {loc(s.day, lang)}{s.time !== '—' ? `, ${s.time}` : ''}
                  </div>
                  {/* Address */}
                  {s.address && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'rgba(255,255,255,0.65)' }}>
                      <MapPin size={11} color="rgba(255,255,255,0.65)" />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.address}</span>
                    </div>
                  )}
                </div>
                {/* Navigation button */}
                {s.address && (
                  <button
                    onClick={(e) => { e.stopPropagation(); hapticFeedback('light'); openLink(`https://maps.google.com/?q=${encodeURIComponent(s.address)}`); }}
                    style={{
                      position: 'absolute', top: 8, right: 8,
                      width: 26, height: 26, borderRadius: 8,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'rgba(255,255,255,0.15)',
                      border: '1px solid rgba(255,255,255,0.25)',
                      cursor: 'pointer',
                    }}
                  >
                    <Navigation size={12} color="#fff" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Group detail modal */}
      <AnimatePresence>
        {selectedGroup && (() => {
          const g = homeGroups.find((h) => h.id === selectedGroup);
          if (!g) return null;
          return (
            <GroupModal
              key={g.id}
              group={g}
              attendance={attendance[g.id]}
              isAttending={myAttending.has(g.id)}
              isLoading={loading === g.id}
              onClose={() => setSelectedGroup(null)}
              onAttend={(e) => handleAttend(e, g.id)}
              onShowAttendees={(e) => e.stopPropagation()}
            />
          );
        })()}
      </AnimatePresence>

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
