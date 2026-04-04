import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, MapPin, Clock, Calendar, Navigation } from 'lucide-react';
import { getUserName, hapticFeedback, openLink } from '@/lib/telegram';
import { ScriptureQuote } from '@/components/shared/ScriptureQuote';
import { services } from '@/data/schedule';
import { upcomingEvents } from '@/data/events';
import { useT, useLang, loc } from '@/i18n/translations';

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

export function HomePage() {
  const navigate = useNavigate();
  const t = useT();
  const lang = useLang();
  const userName = getUserName();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? t.home.greetingMorning : hour < 18 ? t.home.greetingDay : t.home.greetingEvening;
  const nextService = services[0];

  return (
    <motion.div className="page" variants={stagger} initial="hidden" animate="show">
      {/* Header */}
      <motion.div variants={fadeUp} style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{greeting},</p>
            <h1 style={{ fontSize: 22, fontWeight: 700, marginTop: 2 }}>
              Emmanuil Amsterdam
            </h1>
          </div>
          <span style={{
            fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4,
            maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            flexShrink: 0, textAlign: 'right',
          }}>{userName}</span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 4 }}>
          {t.home.subtitle}
        </p>
      </motion.div>

      {/* Scripture in header - compact */}
      <motion.div variants={fadeUp} style={{ marginBottom: 14 }}>
        <ScriptureQuote compact />
      </motion.div>

      {/* Next Service */}
      <motion.div variants={fadeUp} style={{ marginBottom: 18 }}>
        <div className="card card--highlight" style={{ padding: 16 }}>
          <span className="badge badge--primary" style={{ marginBottom: 8 }}>{t.home.nextService}</span>
          <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{loc(nextService.title, lang)}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
              <Calendar size={14} color="var(--primary)" />
              {loc(nextService.day, lang)}, {nextService.time}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
              <MapPin size={14} color="var(--primary)" />
              {nextService.address}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn btn--secondary btn--sm"
              style={{ flex: 1 }}
              onClick={(e) => {
                e.stopPropagation();
                hapticFeedback('light');
                openLink('https://maps.google.com/?q=Javastraat+118,+Amsterdam');
              }}
            >
              <Navigation size={14} />
              {t.home.googleMaps}
            </button>
            <button
              className="btn btn--outline btn--sm"
              style={{ flex: 1 }}
              onClick={(e) => {
                e.stopPropagation();
                hapticFeedback('light');
                openLink('https://maps.apple.com/?q=Javastraat+118,+Amsterdam');
              }}
            >
              <Navigation size={14} />
              {t.home.appleMaps}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <motion.div variants={fadeUp} style={{ marginBottom: 18 }}>
          <div className="section-header">
            <h3 className="section-title">{t.home.importantEvents}</h3>
            <button className="section-link" onClick={() => { hapticFeedback('light'); navigate('/events'); }}>
              {t.home.all} <ChevronRight size={14} style={{ verticalAlign: 'middle' }} />
            </button>
          </div>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 4, marginLeft: 0, marginRight: 0 }}>
            {upcomingEvents.map((ev) => (
              <button
                key={ev.id}
                className="card"
                onClick={() => { hapticFeedback('light'); navigate('/events'); }}
                style={{ minWidth: 180, textAlign: 'left', flexShrink: 0, cursor: 'pointer', padding: 14 }}
              >
                <span className="badge" style={{ background: `${ev.color}18`, color: ev.color, marginBottom: 8 }}>
                  {loc(ev.badge, lang)}
                </span>
                <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{loc(ev.title, lang)}</h4>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  <Calendar size={11} style={{ verticalAlign: 'middle', marginRight: 3 }} />
                  {loc(ev.date, lang)}
                </p>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Quick Schedule */}
      <motion.div variants={fadeUp}>
        <div className="section-header">
          <h3 className="section-title">{t.home.schedule}</h3>
          <button className="section-link" onClick={() => { hapticFeedback('light'); navigate('/schedule'); }}>
            {t.home.details} <ChevronRight size={14} style={{ verticalAlign: 'middle' }} />
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {services.map((s) => (
            <div key={s.id} className="card" style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: s.type === 'service' ? 'var(--primary-bg)' : 'rgba(255,127,80,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Clock size={18} color={s.type === 'service' ? 'var(--primary)' : '#FF7F50'} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 600 }}>{loc(s.title, lang)}</p>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{loc(s.day, lang)}, {s.time}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
