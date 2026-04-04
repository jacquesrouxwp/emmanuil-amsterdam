import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Church, Phone, Share2, Info, ChevronRight, Heart } from 'lucide-react';
import { hapticFeedback, shareUrl } from '@/lib/telegram';
import { useT } from '@/i18n/translations';

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

  const menuItems = [
    { icon: Church, label: t.more.aboutChurch, path: '/about', color: '#C9A96E' },
    { icon: Phone, label: t.more.contacts, path: '/contacts', color: '#5E9ED6' },
  ];

  return (
    <motion.div className="page" variants={stagger} initial="hidden" animate="show">
      <motion.div variants={fadeUp}>
        <h1 className="page-title">{t.more.title}</h1>
        <p className="page-subtitle">Emmanuil Amsterdam</p>
      </motion.div>

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
            shareUrl('https://t.me/EmmanuiBot/app', 'Emmanuil Amsterdam — церква в Telegram!');
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

      <motion.div
        variants={fadeUp}
        style={{ textAlign: 'center', padding: '28px 0 16px', color: 'var(--text-tertiary)' }}
      >
        <Info size={16} style={{ marginBottom: 4, opacity: 0.5 }} />
        <p style={{ fontSize: 12 }}>Emmanuil Amsterdam v1.0.0</p>
        <p style={{ fontSize: 11, marginTop: 2 }}>{t.more.version}</p>
      </motion.div>
    </motion.div>
  );
}
