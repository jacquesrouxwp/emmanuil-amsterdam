import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Music, Baby, Megaphone, Mic2, CheckCircle } from 'lucide-react';
import { hapticFeedback } from '@/lib/telegram';
import { useT } from '@/i18n/translations';

interface Position {
  icon: React.ElementType;
  color: string;
  ua: string;
  ru: string;
  en: string;
}

const positions: Position[] = [
  { icon: Music,     color: '#7C4DFF', ua: 'Група прославлення', ru: 'Группа прославления',  en: 'Worship team' },
  { icon: Baby,      color: '#FF7F50', ua: 'Дитяче служіння',    ru: 'Детское служение',     en: 'Children\'s ministry' },
  { icon: Megaphone, color: '#C9A96E', ua: 'Медіа та соцмережі', ru: 'Медиа и соцсети',      en: 'Media & social media' },
  { icon: Mic2,      color: '#EF4444', ua: 'Євангелізація',      ru: 'Евангелизация',         en: 'Evangelism' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

export function VolunteerPage() {
  const navigate = useNavigate();
  const t = useT();

  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!name.trim()) return;
    hapticFeedback('medium');
    setSubmitted(true);
  };

  const posLabel = (p: Position) =>
    t.lang === 'ua' ? p.ua : t.lang === 'ru' ? p.ru : p.en;

  return (
    <motion.div className="page" variants={stagger} initial="hidden" animate="show">
      {/* Header */}
      <motion.div variants={fadeUp} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
        <button
          onClick={() => { hapticFeedback('light'); navigate('/more'); }}
          style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'var(--surface)',
            border: '1px solid var(--border-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0,
          }}
        >
          <ArrowLeft size={18} color="var(--text)" />
        </button>
        <div>
          <h1 className="page-title" style={{ marginBottom: 0 }}>{t.volunteer.title}</h1>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 40, gap: 16, textAlign: 'center' }}
          >
            <div style={{
              width: 80, height: 80, borderRadius: 24,
              background: 'rgba(76, 175, 80, 0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <CheckCircle size={40} color="#4CAF50" />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 700 }}>{t.volunteer.successTitle}</h2>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 280 }}>
              {t.volunteer.successText}
            </p>
            <button
              className="btn btn--primary"
              style={{ marginTop: 8 }}
              onClick={() => { hapticFeedback('light'); navigate('/more'); }}
            >
              {t.volunteer.backToMore}
            </button>
          </motion.div>
        ) : (
          <motion.div key="form" variants={stagger} initial="hidden" animate="show">
            {/* Intro */}
            <motion.div variants={fadeUp} className="scripture-card" style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <Heart size={18} color="#EF4444" />
                <p style={{ fontSize: 14, fontWeight: 600 }}>{t.volunteer.subtitle}</p>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {t.volunteer.intro}
              </p>
            </motion.div>

            {/* Open positions */}
            <motion.div variants={fadeUp} className="section">
              <h3 className="section-title" style={{ marginBottom: 12 }}>{t.volunteer.positions}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {positions.map((pos, i) => (
                  <div
                    key={i}
                    className="card"
                    style={{ padding: '14px 12px', display: 'flex', alignItems: 'center', gap: 10 }}
                  >
                    <div style={{
                      width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                      background: `${pos.color}15`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <pos.icon size={17} color={pos.color} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.3 }}>
                      {posLabel(pos)}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Application form */}
            <motion.div variants={fadeUp} className="section">
              <h3 className="section-title" style={{ marginBottom: 12 }}>{t.volunteer.formTitle}</h3>
              <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.volunteer.namePlaceholder}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 10,
                    border: '1px solid var(--border-light)',
                    background: 'var(--surface)',
                    fontSize: 14,
                    color: 'var(--text)',
                    outline: 'none',
                    width: '100%',
                  }}
                />
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={t.volunteer.commentPlaceholder}
                  rows={4}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 10,
                    border: '1px solid var(--border-light)',
                    background: 'var(--surface)',
                    fontSize: 14,
                    color: 'var(--text)',
                    outline: 'none',
                    width: '100%',
                    resize: 'none',
                    fontFamily: 'inherit',
                  }}
                />
                <button
                  className="btn btn--primary btn--full"
                  onClick={handleSubmit}
                  disabled={!name.trim()}
                  style={{ opacity: name.trim() ? 1 : 0.5 }}
                >
                  <Heart size={16} />
                  {t.volunteer.submit}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
