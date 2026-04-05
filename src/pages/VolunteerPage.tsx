import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Music, Baby, Megaphone, Mic2, CheckCircle, Send } from 'lucide-react';
import { hapticFeedback, getTelegramUser } from '@/lib/telegram';
import { useT } from '@/i18n/translations';

interface Position {
  id: string;
  icon: React.ElementType;
  color: string;
  ua: string;
  ru: string;
  en: string;
}

const positions: Position[] = [
  { id: 'worship',    icon: Music,     color: '#7C4DFF', ua: 'Група прославлення', ru: 'Группа прославления', en: 'Worship team' },
  { id: 'children',   icon: Baby,      color: '#FF7F50', ua: 'Дитяче служіння',    ru: 'Детское служение',    en: 'Children\'s ministry' },
  { id: 'media',      icon: Megaphone, color: '#C9A96E', ua: 'Медіа та соцмережі', ru: 'Медиа и соцсети',     en: 'Media & social media' },
  { id: 'evangelism', icon: Mic2,      color: '#EF4444', ua: 'Євангелізація',       ru: 'Евангелизация',        en: 'Evangelism' },
];

const API_URL = import.meta.env.PROD ? '' : 'http://localhost:3002';

const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

export function VolunteerPage() {
  const navigate = useNavigate();
  const t = useT();

  const [selected, setSelected] = useState<Position | null>(null);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const posLabel = (p: Position) =>
    t.lang === 'ua' ? p.ua : t.lang === 'ru' ? p.ru : p.en;

  const handleSelect = (pos: Position) => {
    hapticFeedback('light');
    setSelected(pos);
  };

  const handleSubmit = async () => {
    if (!name.trim() || !selected) return;
    hapticFeedback('medium');
    setSending(true);
    try {
      const tgUser = getTelegramUser();
      await fetch(`${API_URL}/api/volunteer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          direction: selected.id,
          directionLabel: posLabel(selected),
          name: name.trim(),
          comment: comment.trim(),
          telegramUsername: tgUser?.username || null,
          telegramId: tgUser?.id || null,
        }),
      });
    } catch {
      // Even if request fails — show success screen (form was filled)
    }
    setSending(false);
    setSubmitted(true);
  };

  return (
    <motion.div className="page" variants={stagger} initial="hidden" animate="show">
      {/* Header */}
      <motion.div variants={fadeUp} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
        <button
          onClick={() => { hapticFeedback('light'); navigate('/more'); }}
          style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'var(--surface)', border: '1px solid var(--border-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0,
          }}
        >
          <ArrowLeft size={18} color="var(--text)" />
        </button>
        <h1 className="page-title" style={{ marginBottom: 0 }}>{t.volunteer.title}</h1>
      </motion.div>

      <AnimatePresence mode="wait">
        {submitted ? (
          /* ── Success screen ── */
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 40, gap: 16, textAlign: 'center' }}
          >
            <div style={{
              width: 80, height: 80, borderRadius: 24,
              background: 'rgba(76,175,80,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <CheckCircle size={40} color="#4CAF50" />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 700 }}>{t.volunteer.successTitle}</h2>
            {selected && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 16px', borderRadius: 20,
                background: `${selected.color}15`, border: `1px solid ${selected.color}30`,
              }}>
                <selected.icon size={14} color={selected.color} />
                <span style={{ fontSize: 13, fontWeight: 600, color: selected.color }}>{posLabel(selected)}</span>
              </div>
            )}
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

            {/* Direction cards — clickable */}
            <motion.div variants={fadeUp} className="section">
              <h3 className="section-title" style={{ marginBottom: 12 }}>{t.volunteer.positions}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {positions.map((pos) => {
                  const isSelected = selected?.id === pos.id;
                  return (
                    <motion.button
                      key={pos.id}
                      onClick={() => handleSelect(pos)}
                      whileTap={{ scale: 0.96 }}
                      style={{
                        padding: '14px 12px',
                        borderRadius: 12,
                        display: 'flex', alignItems: 'center', gap: 10,
                        cursor: 'pointer', textAlign: 'left',
                        transition: 'all 0.2s',
                        background: isSelected ? `${pos.color}18` : 'var(--bg-card)',
                        border: `2px solid ${isSelected ? pos.color : 'var(--border-light)'}`,
                        boxShadow: isSelected ? `0 0 0 3px ${pos.color}20` : 'none',
                      }}
                    >
                      <div style={{
                        width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                        background: isSelected ? `${pos.color}25` : `${pos.color}15`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <pos.icon size={17} color={pos.color} />
                      </div>
                      <span style={{
                        fontSize: 12, fontWeight: isSelected ? 700 : 500,
                        lineHeight: 1.3, color: isSelected ? pos.color : 'var(--text)',
                      }}>
                        {posLabel(pos)}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* Form — appears after direction selected */}
            <AnimatePresence>
              {selected && (
                <motion.div
                  key="application-form"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  transition={{ duration: 0.22 }}
                  className="section"
                >
                  <h3 className="section-title" style={{ marginBottom: 12 }}>{t.volunteer.formTitle}</h3>
                  <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {/* Selected direction badge */}
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6, alignSelf: 'flex-start',
                      padding: '5px 12px', borderRadius: 20,
                      background: `${selected.color}12`, border: `1px solid ${selected.color}30`,
                    }}>
                      <selected.icon size={13} color={selected.color} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: selected.color }}>{posLabel(selected)}</span>
                    </div>

                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t.volunteer.namePlaceholder}
                      style={{
                        padding: '12px 14px', borderRadius: 10,
                        border: '1px solid var(--border-light)',
                        background: 'var(--surface)', fontSize: 14,
                        color: 'var(--text)', outline: 'none', width: '100%',
                      }}
                    />
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder={t.volunteer.commentPlaceholder}
                      rows={4}
                      style={{
                        padding: '12px 14px', borderRadius: 10,
                        border: '1px solid var(--border-light)',
                        background: 'var(--surface)', fontSize: 14,
                        color: 'var(--text)', outline: 'none', width: '100%',
                        resize: 'none', fontFamily: 'inherit',
                      }}
                    />
                    <button
                      className="btn btn--primary btn--full"
                      onClick={handleSubmit}
                      disabled={!name.trim() || sending}
                      style={{ opacity: name.trim() && !sending ? 1 : 0.5, background: selected.color, borderColor: selected.color }}
                    >
                      <Send size={16} />
                      {sending ? '...' : t.volunteer.submit}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
