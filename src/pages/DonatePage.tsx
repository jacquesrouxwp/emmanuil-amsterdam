import { motion } from 'framer-motion';
import { CreditCard, Landmark, ExternalLink } from 'lucide-react';
import { hapticFeedback, openLink } from '@/lib/telegram';
import { useT } from '@/i18n/translations';

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export function DonatePage() {
  const t = useT();

  return (
    <motion.div className="page" variants={stagger} initial="hidden" animate="show">
      <motion.div variants={fadeUp}>
        <h1 className="page-title">{t.donate.title}</h1>
        <p className="page-subtitle" style={{ fontStyle: 'italic', color: 'var(--accent-gold)' }}>
          {t.donate.quote} {t.donate.quoteRef}
        </p>
      </motion.div>

      <motion.div variants={fadeUp} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
        {/* PrivatBank */}
        <button
          className="card"
          onClick={() => {
            hapticFeedback('medium');
            openLink('https://www.privat24.ua/');
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: 16,
            textAlign: 'left',
            cursor: 'pointer',
          }}
        >
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: 'rgba(0, 166, 81, 0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <CreditCard size={24} color="#00A651" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 16, fontWeight: 600 }}>{t.donate.privatbank}</p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
              {t.donate.privatbankDesc}
            </p>
          </div>
          <ExternalLink size={18} color="var(--text-tertiary)" />
        </button>

        {/* iDEAL */}
        <button
          className="card"
          onClick={() => {
            hapticFeedback('medium');
            openLink('https://www.ideal.nl/');
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: 16,
            textAlign: 'left',
            cursor: 'pointer',
          }}
        >
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: 'rgba(204, 0, 102, 0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Landmark size={24} color="#CC0066" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 16, fontWeight: 600 }}>{t.donate.ideal}</p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
              {t.donate.idealDesc}
            </p>
          </div>
          <ExternalLink size={18} color="var(--text-tertiary)" />
        </button>
      </motion.div>

      {/* Note */}
      <motion.div
        variants={fadeUp}
        className="scripture-card"
        style={{ marginTop: 24 }}
      >
        <p className="scripture-text">{t.donate.thanks}</p>
      </motion.div>
    </motion.div>
  );
}
