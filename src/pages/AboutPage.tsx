import { motion } from 'framer-motion';
import { Church, Eye, BookOpen, MapPin, ExternalLink } from 'lucide-react';
import { hapticFeedback, openLink } from '@/lib/telegram';
import { PersonCard } from '@/components/shared/PersonCard';
import { pastors } from '@/data/people';

const beliefs = [
  'Ми віримо в єдиного Бога, який вічно існує в трьох Особах: Отець, Син і Святий Дух.',
  'Ми віримо, що Біблія є богонатхненним, непохибним Словом Божим.',
  'Ми віримо у спасіння з благодаті через віру в Ісуса Христа.',
  'Ми віримо у водне хрещення та хрещення Святим Духом.',
  'Ми віримо у Друге пришестя Господа Ісуса Христа.',
  'Ми віримо в силу молитви та божественне зцілення.',
];

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export function AboutPage() {
  return (
    <motion.div
      className="page"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={fadeUp}>
        <h1 className="page-title">Про церкву</h1>
        <p className="page-subtitle">Emmanuil Amsterdam</p>
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
          Ми — жива, зростаюча церква в серці Амстердама. Наша місія — нести любов Христа
          кожній людині, створюючи тепле суспільство, де кожен може знайти віру, надію та сім'ю.
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
          <h3 className="section-title">Наше бачення</h3>
        </div>
        <div className="card">
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Ми прагнемо бути церквою, яка впливає на місто та країну, виховуючи учнів Христа,
            зміцнюючи сім'ї та служачи суспільству з любов'ю. Ми віримо, що Бог покликав нас бути світлом
            у Нідерландах та за їхніми межами.
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
          <h3 className="section-title">Віровчення</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {beliefs.map((belief, i) => (
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

      {/* Pastor */}
      <motion.div variants={fadeUp} className="section">
        <h3 className="section-title" style={{ marginBottom: 12 }}>Пастор</h3>
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
          <h3 className="section-title">Як нас знайти</h3>
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
            Відкрити на карті
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
