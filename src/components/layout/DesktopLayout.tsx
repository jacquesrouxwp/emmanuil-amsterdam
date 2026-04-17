import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Calendar, Star, Church, Globe, ExternalLink, ChevronDown } from 'lucide-react';
import { useT, useLang, type Lang } from '@/i18n/translations';
import { useAppStore } from '@/store/appStore';

const LANG_OPTIONS: { code: Lang; label: string; native: string }[] = [
  { code: 'ua', label: 'Українська', native: 'УКР' },
  { code: 'ru', label: 'Русский', native: 'РУС' },
  { code: 'en', label: 'English', native: 'ENG' },
  { code: 'nl', label: 'Nederlands', native: 'NL' },
  { code: 'es', label: 'Español', native: 'ES' },
];

const SIDEBAR_W = 272;

export function DesktopLayout({ children }: { children: React.ReactNode }) {
  const t = useT();
  const lang = useLang();
  const { setLang } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [langOpen, setLangOpen] = useState(false);

  const tabs = [
    { path: '/', icon: Home, label: t.nav.home },
    { path: '/schedule', icon: Calendar, label: t.nav.schedule },
    { path: '/events', icon: Star, label: t.nav.events },
    { path: '/more', icon: Church, label: t.nav.more },
  ];

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const currentLang = LANG_OPTIONS.find((l) => l.code === lang)!;

  return (
    <div className="desktop-shell">

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside className="desktop-sidebar">

        {/* Brand */}
        <div className="desktop-brand">
          <div className="desktop-brand-icon">
            <Church size={28} color="#fff" />
          </div>
          <div>
            <p className="desktop-brand-name">Emmanuil</p>
            <p className="desktop-brand-sub">Amsterdam</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="desktop-nav">
          <p className="desktop-nav-section-label">Навигация</p>
          {tabs.map((tab) => {
            const active = isActive(tab.path);
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className={`desktop-nav-item ${active ? 'desktop-nav-item--active' : ''}`}
              >
                <tab.icon size={18} strokeWidth={active ? 2.3 : 1.8} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Bottom controls */}
        <div className="desktop-sidebar-bottom">
          {/* Language */}
          <div style={{ position: 'relative', marginBottom: 8 }}>
            <button
              onClick={() => setLangOpen((v) => !v)}
              className="desktop-lang-btn"
            >
              <Globe size={15} />
              <span style={{ flex: 1, textAlign: 'left' }}>{currentLang.label}</span>
              <span className="desktop-lang-badge">{currentLang.native}</span>
              <ChevronDown size={13} style={{ opacity: 0.5 }} />
            </button>
            <AnimatePresence>
              {langOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={() => setLangOpen(false)}
                    style={{ position: 'fixed', inset: 0, zIndex: 199 }}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.14 }}
                    className="desktop-lang-dropdown"
                  >
                    {LANG_OPTIONS.map(({ code, label, native }, i) => (
                      <button
                        key={code}
                        onClick={() => { setLang(code); setLangOpen(false); }}
                        className={`desktop-lang-option ${lang === code ? 'desktop-lang-option--active' : ''}`}
                        style={{ borderBottom: i < LANG_OPTIONS.length - 1 ? '1px solid var(--border-light)' : 'none' }}
                      >
                        {label}
                        {lang === code && <span style={{ fontSize: 10, fontWeight: 700 }}>{native}</span>}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Telegram CTA */}
          <button
            onClick={() => window.open('https://t.me/myconclaw_bot/app', '_blank', 'noopener')}
            className="desktop-tg-btn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.941z"/>
            </svg>
            <span style={{ flex: 1 }}>Открыть в Telegram</span>
            <ExternalLink size={12} style={{ opacity: 0.6 }} />
          </button>

          <p style={{ fontSize: 11, color: 'var(--text-tertiary)', textAlign: 'center', marginTop: 12, opacity: 0.6 }}>
            © 2025 Emmanuil Amsterdam
          </p>
        </div>
      </aside>

      {/* ── Main content ────────────────────────────────────────────────── */}
      <main className="desktop-main">
        <div className="desktop-content">
          {children}
        </div>
      </main>

    </div>
  );
}
