import { motion } from 'framer-motion';
import { Church, Eye, BookOpen, MapPin, ExternalLink, Globe } from 'lucide-react';
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
  show: { transition: { staggerChildren: 0.08 } },
};

export function AboutPage() {
  const t = useT();

  return (
    <motion.div
      className="page"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={fadeUp}>
        <h1 className="page-title">{t.about.title}</h1>
        <p className="page-subtitle">{t.about.subtitle}</p>
      </motion.div>

      {/* Hero Card */}
      <motion.div
        variants={fadeUp}
        className="card card--highlight"
        style={{
          padding: 24,
          marginBottom: 24,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 20,
            background: 'var(--primary-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}
        >
          <Church size={36} color="var(--primary)" />
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
          Emmanuil Amsterdam
        </h2>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          {t.about.description}
        </p>
      </motion.div>

      {/* Vision */}
      <motion.div variants={fadeUp} className="section">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'var(--accent-gold-bg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Eye size={18} color="var(--accent-gold)" />
          </div>
          <h3 className="section-title">{t.about.vision}</h3>
        </div>
        <div className="card">
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            {t.about.visionDesc}
          </p>
        </div>
      </motion.div>

      {/* Beliefs */}
      <motion.div variants={fadeUp} className="section">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'var(--primary-bg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <BookOpen size={18} color="var(--primary)" />
          </div>
          <h3 className="section-title">{t.about.beliefs}</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {t.beliefs.map((belief, i) => (
            <div key={i} className="card" style={{ padding: 14 }}>
              <div style={{ display: 'flex', gap: 10 }}>
                <span style={{
                  width: 24, height: 24, borderRadius: '50%',
                  background: 'var(--primary-bg)', color: 'var(--primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 600, flexShrink: 0,
                }}>
                  {i + 1}
                </span>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {belief}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Gospel section */}
      <motion.div variants={fadeUp} className="section">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'rgba(52,199,89,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Globe size={18} color="#34C759" />
          </div>
          <h3 className="section-title">{t.about.gospel}</h3>
        </div>
        <div className="card" style={{ padding: 16 }}>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            {t.about.gospelDesc}
          </p>
        </div>
      </motion.div>

      {/* Pastor */}
      <motion.div variants={fadeUp} className="section">
        <h3 className="section-title" style={{ marginBottom: 12 }}>{t.about.pastor}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {pastors.map((person, i) => (
            <PersonCard key={person.id} person={person} index={i} />
          ))}
        </div>
      </motion.div>

      {/* Location */}
      <motion.div variants={fadeUp} className="section">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'var(--primary-bg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <MapPin size={18} color="var(--primary)" />
          </div>
          <h3 className="section-title">{t.about.location}</h3>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Emmanuil Amsterdam</p>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16 }}>
            Javastraat 118, Amsterdam
          </p>
          <button
            className="btn btn--secondary btn--full"
            onClick={() => {
              hapticFeedback('light');
              openLink('https://maps.google.com/?q=Javastraat+118+Amsterdam');
            }}
          >
            <ExternalLink size={16} />
            {t.about.openMap}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
