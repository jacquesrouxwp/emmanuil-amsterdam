import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, MapPin, Clock, Users, Calendar, ExternalLink, ChevronRight } from 'lucide-react';
import { getUserName, hapticFeedback } from '@/lib/telegram';
import { ScriptureQuote } from '@/components/shared/ScriptureQuote';
import { ChurchStats } from '@/components/shared/ChurchStats';
import { BlogFeed } from '@/components/shared/BlogFeed';
import { useT, useLang } from '@/i18n/translations';
import { useAppStore } from '@/store/appStore';
import { useIsDesktop } from '@/hooks/useIsDesktop';
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

// ── Desktop Hero ─────────────────────────────────────────────────────────────
function DesktopHero() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: 36,
        position: 'relative',
        background: 'linear-gradient(150deg, #0d2137 0%, #1a3a5c 40%, #0f2744 70%, #0a1a2e 100%)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3)',
      }}
    >
      {/* Background decorative elements */}
      <div style={{
        position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
      }}>
        {/* Glow circle top-right */}
        <div style={{
          position: 'absolute', top: -80, right: -80,
          width: 320, height: 320, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(94,158,214,0.18) 0%, transparent 70%)',
        }} />
        {/* Glow circle bottom-left */}
        <div style={{
          position: 'absolute', bottom: -60, left: -60,
          width: 240, height: 240, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,169,110,0.12) 0%, transparent 70%)',
        }} />
        {/* Subtle grid pattern */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
      </div>

      {/* Content */}
      <div style={{ position: 'relative', padding: '52px 52px 44px' }}>

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(94,158,214,0.15)', border: '1px solid rgba(94,158,214,0.3)',
          borderRadius: 100, padding: '5px 14px', marginBottom: 22,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#5E9ED6' }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#89BBE5', letterSpacing: 0.5 }}>
            EMMANUIL AMSTERDAM
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: 52, fontWeight: 800, color: '#fff',
          lineHeight: 1.1, letterSpacing: -1.5,
          marginBottom: 18, maxWidth: 560,
        }}>
          Церква для{' '}
          <span style={{
            background: 'linear-gradient(90deg, #5E9ED6, #89BBE5)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            всіх народів
          </span>
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: 17, color: 'rgba(255,255,255,0.6)',
          lineHeight: 1.65, maxWidth: 480, marginBottom: 36,
        }}>
          Євангельська церква в серці Нідерландів. Богослужіння, молодіжні зустрічі та домашні групи по всій країні.
        </p>

        {/* CTA buttons */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 44 }}>
          <button
            onClick={() => navigate('/schedule')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '13px 24px', borderRadius: 12,
              background: '#5E9ED6', color: '#fff',
              fontWeight: 600, fontSize: 15, cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(94,158,214,0.35)',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(94,158,214,0.4)'; }}
            onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(94,158,214,0.35)'; }}
          >
            <Calendar size={17} />
            Розклад служінь
          </button>
          <button
            onClick={() => window.open('https://t.me/myconclaw_bot/app', '_blank', 'noopener')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '13px 24px', borderRadius: 12,
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#fff', fontWeight: 600, fontSize: 15, cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.13)'; }}
            onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.941z"/>
            </svg>
            Відкрити в Telegram
            <ExternalLink size={14} style={{ opacity: 0.6 }} />
          </button>
        </div>

        {/* Key facts bar */}
        <div style={{
          display: 'flex', gap: 0,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 14, overflow: 'hidden',
        }}>
          {[
            { icon: Clock, text: 'Неділя 17:00' },
            { icon: MapPin, text: 'Javastraat 118, Amsterdam' },
            { icon: Users, text: '500+ людей' },
          ].map((item, i) => (
            <div key={i} style={{
              flex: 1, display: 'flex', alignItems: 'center', gap: 9,
              padding: '14px 18px',
              borderRight: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none',
            }}>
              <item.icon size={15} color="rgba(255,255,255,0.4)" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ── Desktop two-column home layout ───────────────────────────────────────────
function DesktopHomeContent() {
  const t = useT();
  const navigate = useNavigate();

  return (
    <>
      <DesktopHero />

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        style={{ marginBottom: 36 }}
      >
        <ChurchStats />
      </motion.div>

      {/* Two-column: Feed + Quick links */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>
        {/* Blog feed */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <BlogFeed title={t.home.churchLife} />
        </motion.div>

        {/* Right column: Scripture + Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.4 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
        >
          <ScriptureQuote compact />

          {/* Quick links */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: 'var(--text-tertiary)', textTransform: 'uppercase', padding: '14px 16px 8px' }}>
              Швидкий доступ
            </p>
            {[
              { label: 'Розклад служінь', path: '/schedule', color: '#5E9ED6' },
              { label: 'Важливі події', path: '/events', color: '#C9A96E' },
              { label: 'Домашні групи', path: '/schedule', color: '#7c4dff' },
              { label: 'Про церкву', path: '/more', color: '#34C759' },
            ].map((item, i, arr) => (
              <button
                key={item.path + item.label}
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '11px 16px', width: '100%', textAlign: 'left', cursor: 'pointer',
                  borderTop: i > 0 ? '1px solid var(--border-light)' : 'none',
                  fontSize: 14, fontWeight: 500,
                  transition: 'background 0.12s',
                }}
                onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-secondary)'; }}
                onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.background = ''; }}
              >
                <div style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: item.color, flexShrink: 0,
                }} />
                <span style={{ flex: 1 }}>{item.label}</span>
                <ChevronRight size={15} color="var(--text-tertiary)" />
              </button>
            ))}
          </div>

          {/* Instagram card */}
          <button
            className="card"
            onClick={() => window.open('https://www.instagram.com/emmanuil.amsterdam', '_blank', 'noopener')}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: 14, cursor: 'pointer', textAlign: 'left',
              background: 'linear-gradient(135deg, rgba(240,148,51,0.08) 0%, rgba(188,24,136,0.08) 100%)',
              border: '1px solid rgba(240,148,51,0.2)',
            }}
          >
            <div style={{
              width: 38, height: 38, borderRadius: 10, flexShrink: 0,
              background: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 600 }}>@emmanuil.amsterdam</p>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Instagram</p>
            </div>
            <ExternalLink size={14} color="var(--text-tertiary)" />
          </button>
        </motion.div>
      </div>
    </>
  );
}

// ── Page component ────────────────────────────────────────────────────────────
export function HomePage() {
  const t = useT();
  const lang = useLang();
  const { setLang } = useAppStore();
  const userName = getUserName();
  const isDesktop = useIsDesktop();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? t.home.greetingMorning : hour < 18 ? t.home.greetingDay : t.home.greetingEvening;
  const [langModalOpen, setLangModalOpen] = useState(false);
  const currentLang = LANG_OPTIONS.find((l) => l.code === lang)!;

  // Desktop: render full wide layout
  if (isDesktop) {
    return <DesktopHomeContent />;
  }

  // Mobile: beautiful layout
  return (
    <motion.div
      style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}
      variants={stagger} initial="hidden" animate="show"
    >
      {/* ── Hero cover ─────────────────────────────────────────── */}
      <motion.div variants={fadeUp} style={{ position: 'relative', marginBottom: 0 }}>
        {/* Cover photo */}
        <div style={{
          height: 220, width: '100%',
          background: 'url(https://i.ibb.co/HfHyBkxm/amster.jpg) center/cover no-repeat',
          position: 'relative',
        }}>
          {/* Dark gradient overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.72) 100%)',
          }} />

          {/* Lang picker — top right */}
          <div style={{ position: 'absolute', top: 14, right: 16 }}>
            <button
              onClick={() => { hapticFeedback('light'); setLangModalOpen(true); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '5px 11px', borderRadius: 20,
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.2)',
                cursor: 'pointer',
              }}
            >
              <Globe size={11} color="#fff" />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: 0.5 }}>
                {currentLang.native}
              </span>
            </button>
          </div>

          {/* Church name + greeting — bottom left */}
          <div style={{ position: 'absolute', bottom: 18, left: 18, right: 60 }}>
            <p style={{
              fontSize: 12, color: 'rgba(255,255,255,0.65)',
              fontWeight: 500, marginBottom: 4, letterSpacing: 0.2,
            }}>
              {greeting}{userName ? `, ${userName}` : ''}
            </p>
            <h1 style={{
              fontSize: 24, fontWeight: 800, color: '#fff',
              letterSpacing: -0.5, lineHeight: 1.1, marginBottom: 6,
            }}>
              Emmanuil Amsterdam
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <MapPin size={11} color="rgba(255,255,255,0.55)" />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>
                Amsterdam · Неділя 17:00
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Content ────────────────────────────────────────────── */}
      <div style={{ padding: '16px 16px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Scripture */}
        <motion.div variants={fadeUp}>
          <ScriptureQuote compact />
        </motion.div>

        {/* Blog feed */}
        <motion.div variants={fadeUp}>
          <BlogFeed title={t.home.churchLife} />
        </motion.div>
      </div>

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
