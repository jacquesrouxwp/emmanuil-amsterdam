import { motion } from 'framer-motion';
import { Instagram, ExternalLink } from 'lucide-react';
import { hapticFeedback, openLink } from '@/lib/telegram';
import { PersonCard } from '@/components/shared/PersonCard';
import { pastors } from '@/data/people';
import { useT } from '@/i18n/translations';

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

export function ContactsPage() {
  const t = useT();

  return (
    <motion.div
      className="page"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={fadeUp}>
        <h1 className="page-title">{t.contacts.title}</h1>
        <p className="page-subtitle">{t.contacts.subtitle}</p>
      </motion.div>

      <motion.div variants={fadeUp} className="section">
        <h3 className="section-title" style={{ marginBottom: 12 }}>{t.contacts.pastor}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {pastors.map((p, i) => (
            <PersonCard key={p.id} person={p} index={i} showActions />
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="section">
        <h3 className="section-title" style={{ marginBottom: 12 }}>{t.contacts.socials}</h3>
        <button
          className="card"
          onClick={() => {
            hapticFeedback('light');
            openLink('https://www.instagram.com/emmanuil.amsterdam');
          }}
          style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: 16, width: '100%', textAlign: 'left', cursor: 'pointer',
          }}
        >
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Instagram size={22} color="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 15, fontWeight: 600 }}>Instagram</p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 1 }}>
              @emmanuil.amsterdam
            </p>
          </div>
          <ExternalLink size={18} color="var(--text-tertiary)" />
        </button>
      </motion.div>
    </motion.div>
  );
}
