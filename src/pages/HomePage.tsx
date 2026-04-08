import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Navigation, Globe } from 'lucide-react';
import { getUserName, hapticFeedback, openLink } from '@/lib/telegram';
import { ScriptureQuote } from '@/components/shared/ScriptureQuote';
import { BlogFeed } from '@/components/shared/BlogFeed';
import { services } from '@/data/schedule';
import { useT, useLang, loc } from '@/i18n/translations';
import { useAppStore } from '@/store/appStore';
import type { Lang } from '@/i18n/translations';

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const LANG_OPTIONS: { code: Lang; label: string; native: string }[] = [
  { code: 'ua', label: 'Українська', native: 'УКР' },
  { code: 'ru', label: 'Русский',    native: 'РУС' },
  { code: 'en', label: 'English',    native: 'ENG' },
];

export function HomePage() {
  const t = useT();
  const lang = useLang();
  const { setLang } = useAppStore();
  const userName = getUserName();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? t.home.greetingMorning : hour < 18 ? t.home.greetingDay : t.home.greetingEvening;
  const nextService = services[0];
  const [langModalOpen, setLangModalOpen] = useState(false);

  const currentLang = LANG_OPTIONS.find((l) => l.code === lang)!;

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
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
            <span style={{
              fontSize: 12, color: 'var(--text-tertiary)',
              maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              textAlign: 'right',
            }}>{userName}</span>
            {/* Language button */}
            <button
              onClick={() => { hapticFeedback('light'); setLangModalOpen(true); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '4px 10px', borderRadius: 20,
                background: 'var(--primary-bg)',
                border: '1px solid var(--primary)',
                cursor: 'pointer',
              }}
            >
              <Globe size={12} color="var(--primary)" />
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', letterSpacing: 0.5 }}>
                {currentLang.native}
              </span>
            </button>
          </div>
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

      {/* Blog feed */}
      <motion.div variants={fadeUp}>
        <BlogFeed
          title={
            lang === 'ua' ? 'Життя церкви' :
            lang === 'ru' ? 'Жизнь церкви' :
            'Church Life'
          }
        />
      </motion.div>

      {/* Language dropdown */}
      <AnimatePresence>
        {langModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLangModalOpen(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 100 }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: -6 }}
              transition={{ duration: 0.14, ease: 'easeOut' }}
              style={{
                position: 'fixed',
                top: 68, right: 16,
                zIndex: 101,
                background: '#1c2a3a',
                borderRadius: 14,
                overflow: 'hidden',
                boxShadow: '0 12px 40px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.3)',
                minWidth: 170,
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {LANG_OPTIONS.map(({ code, label, native }, i) => (
                <button
                  key={code}
                  onClick={() => { hapticFeedback('light'); setLang(code); setLangModalOpen(false); }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '11px 14px',
                    width: '100%', cursor: 'pointer',
                    borderBottom: i < LANG_OPTIONS.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                    background: lang === code ? 'rgba(94,158,214,0.18)' : 'transparent',
                    gap: 20,
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: lang === code ? 700 : 400, color: lang === code ? '#5E9ED6' : 'rgba(255,255,255,0.85)' }}>
                    {label}
                  </span>
                  {lang === code && (
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#5E9ED6', letterSpacing: 0.5, background: 'rgba(94,158,214,0.18)', padding: '2px 6px', borderRadius: 6 }}>
                      {native}
                    </span>
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
