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

export function MorePage() {
  const navigate = useNavigate();
  const t = useT();

  // ── Admin tap counter — persists across renders via refs ──────────────────
  const tapCount = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Admin mode state — read from localStorage ─────────────────────────────
  const [isAdminMode, setIsAdminMode] = useState(() => {
    return localStorage.getItem(ADMIN_MODE_KEY) === 'true';
  });

  // Keep in sync if AdminPage activates/deactivates admin mode in another tab
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === ADMIN_MODE_KEY) setIsAdminMode(e.newValue === 'true');
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Re-check on focus (same tab, came back from AdminPage)
  useEffect(() => {
    const onFocus = () => setIsAdminMode(localStorage.getItem(ADMIN_MODE_KEY) === 'true');
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  const handleVersionTap = () => {
    tapCount.current += 1;
    if (tapTimer.current) clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => { tapCount.current = 0; }, 800);
    if (tapCount.current >= 5) {
      tapCount.current = 0;
      hapticFeedback('medium');
      navigate('/admin');
    }
  };

  const menuItems = [
    { icon: Church, label: t.more.aboutChurch, path: '/about', color: '#C9A96E' },
    { icon: Phone, label: t.more.contacts, path: '/contacts', color: '#5E9ED6' },
  ];

  return (
    <motion.div className="page" variants={stagger} initial="hidden" animate="show">
      <motion.div variants={fadeUp} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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

      {/* Version footer — 5 quick taps to open admin */}
      <motion.div variants={fadeUp} style={{ textAlign: 'center', padding: '28px 0 16px', color: 'var(--text-tertiary)' }}>
        <Info size={16} style={{ marginBottom: 4, opacity: 0.5 }} />
        <p style={{ fontSize: 12 }}>Emmanuil Amsterdam v1.0.0</p>
        <p
          style={{ fontSize: 11, marginTop: 2, userSelect: 'none' }}
          onClick={handleVersionTap}
        >
          {t.more.version}
        </p>
      </motion.div>
    </motion.div>
  );
}
