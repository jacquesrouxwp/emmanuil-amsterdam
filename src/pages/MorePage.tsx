import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Church, Phone, Share2, Info, ChevronRight, Heart, Shield } from 'lucide-react';
import { hapticFeedback, shareUrl } from '@/lib/telegram';
import { useT } from '@/i18n/translations';
import { ADMIN_MODE_KEY } from './AdminPage';

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const TAP_TARGET = 5;      // taps to unlock
const TAP_WINDOW = 1500;   // ms — time between taps before reset

export function MorePage() {
  const navigate = useNavigate();
  const t = useT();

  // ── Admin tap counter — persists across renders via refs ──────────────────
  const tapCount = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [tapProgress, setTapProgress] = useState(0); // triggers re-render for visual feedback

  // ── Admin mode state — read from localStorage on every mount ──────────────
  const [isAdminMode, setIsAdminMode] = useState(
    () => localStorage.getItem(ADMIN_MODE_KEY) === 'true',
  );

  // Reset tap counter + re-read admin mode every mount (fresh state)
  useEffect(() => {
    tapCount.current = 0;
    setTapProgress(0);
    setIsAdminMode(localStorage.getItem(ADMIN_MODE_KEY) === 'true');

    // Cross-tab sync
    const onStorage = (e: StorageEvent) => {
      if (e.key === ADMIN_MODE_KEY) {
        setIsAdminMode(e.newValue === 'true');
      }
    };
    // Same-tab sync (return from AdminPage)
    const onFocus = () => {
      setIsAdminMode(localStorage.getItem(ADMIN_MODE_KEY) === 'true');
    };
    const onVisible = () => {
      if (document.visibilityState === 'visible') onFocus();
    };

    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      if (tapTimer.current) clearTimeout(tapTimer.current);
      tapTimer.current = null;
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  const registerTap = () => {
    tapCount.current += 1;
    setTapProgress(tapCount.current);
    hapticFeedback('light');

    if (tapTimer.current) clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => {
      tapCount.current = 0;
      setTapProgress(0);
    }, TAP_WINDOW);

    if (tapCount.current >= TAP_TARGET) {
      if (tapTimer.current) {
        clearTimeout(tapTimer.current);
        tapTimer.current = null;
      }
      tapCount.current = 0;
      setTapProgress(0);
      hapticFeedback('medium');
      // Small delay so user sees the final haptic before nav
      setTimeout(() => navigate('/admin'), 50);
    }
  };

  const menuItems = [
    { icon: Church, label: t.more.aboutChurch, path: '/about', color: '#C9A96E' },
    { icon: Phone, label: t.more.contacts, path: '/contacts', color: '#5E9ED6' },
  ];

  return (
    <motion.div className="page" variants={stagger} initial="hidden" animate="show">
      <motion.div
        variants={fadeUp}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <h1 className="page-title" style={{ margin: 0 }}>{t.more.title}</h1>
        {isAdminMode && (
          <span style={{
            fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 20,
            background: 'rgba(201,169,110,0.15)', color: '#C9A96E',
            border: '1px solid rgba(201,169,110,0.3)', letterSpacing: 0.5,
          }}>
            ADMIN
          </span>
        )}
      </motion.div>
      <motion.div variants={fadeUp}>
        <p className="page-subtitle" style={{ marginTop: 2 }}>Emmanuil Amsterdam</p>
      </motion.div>

      {/* Admin panel shortcut — only visible in admin mode */}
      {isAdminMode && (
        <motion.div variants={fadeUp}>
          <button
            className="card"
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 16px', width: '100%', textAlign: 'left', cursor: 'pointer', marginBottom: 14,
              borderLeft: '3px solid #C9A96E',
            }}
            onClick={() => { hapticFeedback('medium'); navigate('/admin'); }}
          >
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: 'rgba(201,169,110,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Shield size={20} color="#C9A96E" />
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: '#C9A96E' }}>Панель администратора</span>
              <p style={{ fontSize: 12, color: 'var(--text-tertiary)', margin: 0, marginTop: 1 }}>Управление контентом</p>
            </div>
            <ChevronRight size={18} color="#C9A96E" />
          </button>
        </motion.div>
      )}

      {/* Main menu */}
      <motion.div
        variants={fadeUp}
        className="card"
        style={{ padding: 0, overflow: 'hidden', marginBottom: 14 }}
      >
        {menuItems.map((item, i) => (
          <button
            key={item.path}
            onClick={() => { hapticFeedback('light'); navigate(item.path); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 16px', width: '100%', textAlign: 'left', cursor: 'pointer',
              borderBottom: i < menuItems.length - 1 ? '1px solid var(--border-light)' : 'none',
            }}
          >
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: `${item.color}15`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <item.icon size={20} color={item.color} />
            </div>
            <span style={{ flex: 1, fontSize: 15, fontWeight: 500 }}>{item.label}</span>
            <ChevronRight size={18} color="var(--text-tertiary)" />
          </button>
        ))}
      </motion.div>

      {/* Volunteer button */}
      <motion.div variants={fadeUp}>
        <button
          className="card"
          style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '14px 16px', width: '100%', textAlign: 'left', cursor: 'pointer', marginBottom: 14,
          }}
          onClick={() => { hapticFeedback('medium'); navigate('/volunteer'); }}
        >
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'rgba(239, 68, 68, 0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Heart size={20} color="#EF4444" />
          </div>
          <span style={{ flex: 1, fontSize: 15, fontWeight: 500 }}>{t.more.volunteer}</span>
          <ChevronRight size={18} color="var(--text-tertiary)" />
        </button>
      </motion.div>

      {/* Share */}
      <motion.div variants={fadeUp}>
        <button
          className="card"
          style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '14px 16px', width: '100%', textAlign: 'left', cursor: 'pointer', marginBottom: 14,
          }}
          onClick={() => {
            hapticFeedback('light');
            shareUrl('https://t.me/myconclaw_bot/app', 'Emmanuil Amsterdam — церква в Telegram!');
          }}
        >
          <div style={{
            width: 38, height: 38, borderRadius: 10, background: 'var(--primary-bg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Share2 size={20} color="var(--primary)" />
          </div>
          <span style={{ flex: 1, fontSize: 15, fontWeight: 500 }}>{t.more.share}</span>
          <ChevronRight size={18} color="var(--text-tertiary)" />
        </button>
      </motion.div>

      {/* Version footer — 5 quick taps on the tap zone to open admin */}
      <motion.div
        variants={fadeUp}
        style={{ textAlign: 'center', padding: '28px 0 16px', color: 'var(--text-tertiary)' }}
      >
        <Info size={16} style={{ marginBottom: 4, opacity: 0.5 }} />
        <p style={{ fontSize: 12 }}>Emmanuil Amsterdam v1.0.0</p>

        {/* Entire tap zone — use pointerDown for reliable mobile touch */}
        <div
          onPointerDown={(e) => { e.preventDefault(); registerTap(); }}
          style={{
            display: 'inline-block',
            marginTop: 2,
            padding: '8px 14px',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            WebkitTapHighlightColor: 'transparent',
            touchAction: 'manipulation',
            cursor: 'pointer',
          }}
        >
          <p style={{ fontSize: 11, margin: 0 }}>{t.more.version}</p>
          {/* Progress dots — appear after 2nd tap */}
          {tapProgress > 0 && (
            <div style={{
              display: 'flex',
              gap: 4,
              justifyContent: 'center',
              marginTop: 4,
              opacity: tapProgress >= 2 ? 1 : 0,
              transition: 'opacity 0.15s',
            }}>
              {Array.from({ length: TAP_TARGET }).map((_, i) => (
                <span
                  key={i}
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: i < tapProgress ? '#C9A96E' : 'rgba(255,255,255,0.15)',
                    transition: 'background 0.1s',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
