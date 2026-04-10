import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe } from 'lucide-react';
import { getUserName, hapticFeedback } from '@/lib/telegram';
import { ScriptureQuote } from '@/components/shared/ScriptureQuote';
import { BlogFeed } from '@/components/shared/BlogFeed';
import { useT, useLang } from '@/i18n/translations';
import { useAppStore } from '@/store/appStore';
import type { Lang } from '@/i18n/translations';

const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

const LANG_OPTIONS: { code: Lang; label: string; native: string }[] = [
  { code: 'ua', label: 'Українська', native: 'УКР' },
  { code: 'ru', label: 'Русский',    native: 'РУС' },
  { code: 'en', label: 'English',    native: 'ENG' },
  { code: 'nl', label: 'Nederlands', native: 'NL'  },
  { code: 'es', label: 'Español',    native: 'ES'  },
];

export function HomePage() {
  const t = useT();
  const lang = useLang();
  const { setLang } = useAppStore();
  const userName = getUserName();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? t.home.greetingMorning : hour < 18 ? t.home.greetingDay : t.home.greetingEvening;
  const [langModalOpen, setLangModalOpen] = useState(false);

  const currentLang = LANG_OPTIONS.find((l) => l.code === lang)!;

  return (
    <motion.div className="page" variants={stagger} initial="hidden" animate="show">
      {/* Header */}
      <motion.div variants={fadeUp} style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{greeting},</p>
            <h1 style={{ fontSize: 22, fontWeight: 700, marginTop: 2 }}>Emmanuil Amsterdam</h1>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'right' }}>
              {userName}
            </span>
            <button
              onClick={() => { hapticFeedback('light'); setLangModalOpen(true); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '4px 10px', borderRadius: 20,
                background: 'var(--primary-bg)', border: '1px solid var(--primary)', cursor: 'pointer',
              }}
            >
              <Globe size={12} color="var(--primary)" />
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', letterSpacing: 0.5 }}>
                {currentLang.native}
              </span>
            </button>
          </div>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 4 }}>{t.home.subtitle}</p>
      </motion.div>

      {/* Scripture */}
      <motion.div variants={fadeUp} style={{ marginBottom: 14 }}>
        <ScriptureQuote compact />
      </motion.div>

      {/* Blog feed */}
      <motion.div variants={fadeUp}>
        <BlogFeed title={t.home.churchLife} />
      </motion.div>

      {/* Language dropdown */}
      <AnimatePresence>
        {langModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setLangModalOpen(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 100 }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: -6 }}
              transition={{ duration: 0.14, ease: 'easeOut' }}
              style={{
                position: 'fixed', top: 68, right: 16, zIndex: 101,
                background: '#1c2a3a', borderRadius: 14, overflow: 'hidden',
                boxShadow: '0 12px 40px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.3)',
                minWidth: 170, border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {LANG_OPTIONS.map(({ code, label, native }, i) => (
                <button
                  key={code}
                  onClick={() => { hapticFeedback('light'); setLang(code); setLangModalOpen(false); }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '11px 14px', width: '100%', cursor: 'pointer', gap: 20,
                    borderBottom: i < LANG_OPTIONS.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                    background: lang === code ? 'rgba(94,158,214,0.18)' : 'transparent',
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
