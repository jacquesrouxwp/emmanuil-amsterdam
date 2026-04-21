import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronRight, MapPin } from 'lucide-react';
import { hapticFeedback } from '@/lib/telegram';
import { useUserStore } from '@/store/userStore';
import { churchLocations } from '@/data/churches';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

// ── Church selector ───────────────────────────────────────────────────────────
function ChurchSelector({ onSelect }: { onSelect: (id: string) => void }) {
  const [q, setQ] = useState('');
  const filtered = churchLocations.filter((c) => {
    if (!q) return true;
    const s = q.toLowerCase();
    return c.name.toLowerCase().includes(s) || c.city.toLowerCase().includes(s);
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}
    >
      <p style={{ fontSize: 16, fontWeight: 700, textAlign: 'center', color: 'var(--text-primary)' }}>
        Оберіть вашу церкву
      </p>

      {/* Search */}
      <div style={{ position: 'relative' }}>
        <Search size={14} color="var(--text-tertiary)"
          style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Пошук за назвою або містом..."
          style={{
            width: '100%', padding: '11px 12px 11px 36px',
            borderRadius: 12, fontSize: 14,
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-light)',
            color: 'var(--text-primary)',
          }}
        />
      </div>

      {/* List */}
      <div style={{
        maxHeight: 320, overflowY: 'auto',
        display: 'flex', flexDirection: 'column', gap: 6,
      }}>
        {filtered.slice(0, 20).map((c) => (
          <button
            key={c.id}
            onClick={() => { hapticFeedback('light'); onSelect(c.id); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 14px', borderRadius: 12, cursor: 'pointer',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-light)',
              textAlign: 'left',
              transition: 'background 0.12s',
            }}
          >
            <div style={{
              width: 38, height: 38, borderRadius: 10, flexShrink: 0,
              background: 'linear-gradient(135deg, #1a3a5c, #2d5a8e)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>
                {c.name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()}
              </span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{c.name}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                <MapPin size={10} color="var(--text-tertiary)" />
                <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{c.city}, {c.country}</p>
              </div>
            </div>
            <ChevronRight size={15} color="var(--text-tertiary)" />
          </button>
        ))}
        {filtered.length === 0 && (
          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-tertiary)', padding: '24px 0' }}>
            Церкву не знайдено
          </p>
        )}
      </div>
    </motion.div>
  );
}

// ── Main welcome page ─────────────────────────────────────────────────────────
export function WelcomePage() {
  const navigate = useNavigate();
  const { completeOnboarding } = useUserStore();
  const [step, setStep] = useState<'choose' | 'church'>('choose');

  const handleVisitor = () => {
    hapticFeedback('light');
    completeOnboarding('visitor');
    navigate('/world');
  };

  const handleMember = () => {
    hapticFeedback('light');
    setStep('church');
  };

  const handleChurchSelect = (id: string) => {
    completeOnboarding('member', id);
    navigate('/');
  };

  const handleInvite = () => {
    hapticFeedback('medium');
    completeOnboarding('pastor');
    navigate('/invite-flow');
  };

  return (
    <div style={{
      minHeight: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '32px 24px 48px',
      background: 'var(--bg)',
    }}>
      <AnimatePresence mode="wait">

        {/* ── Step 1: choose role ── */}
        {step === 'choose' && (
          <motion.div
            key="choose"
            variants={stagger} initial="hidden" animate="show" exit={{ opacity: 0, y: -10 }}
            style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}
          >
            {/* Logo + title */}
            <motion.div variants={fadeUp} style={{ textAlign: 'center' }}>
              <div style={{
                width: 72, height: 72, borderRadius: 22, margin: '0 auto 18px',
                background: 'linear-gradient(135deg, #1a3a5c 0%, #2d5a8e 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 32px rgba(94,158,214,0.3)',
              }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 2a14.5 14.5 0 0 1 0 20 14.5 14.5 0 0 1 0-20"/>
                  <path d="M2 12h20"/>
                </svg>
              </div>
              <h1 style={{ fontSize: 34, fontWeight: 800, letterSpacing: -1, color: 'var(--text-primary)', marginBottom: 8 }}>
                Kairos
              </h1>
              <p style={{ fontSize: 14, color: 'var(--text-tertiary)', lineHeight: 1.5, maxWidth: 260, margin: '0 auto' }}>
                Мережа церков. Живіть разом, ростіть разом.
              </p>
            </motion.div>

            {/* Options */}
            <motion.div variants={fadeUp} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>

              {/* Invitation — pastor */}
              <button
                onClick={handleInvite}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '16px 18px', borderRadius: 16, cursor: 'pointer',
                  background: 'linear-gradient(135deg, #0d1f33 0%, #1a3a5c 100%)',
                  border: '1px solid rgba(94,158,214,0.25)',
                  textAlign: 'left', width: '100%',
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: 'rgba(94,158,214,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontSize: 22 }}>🎟️</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 3 }}>
                    У мене є запрошення
                  </p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.4 }}>
                    Я пастор — отримав посилання від колеги
                  </p>
                </div>
                <ChevronRight size={16} color="rgba(255,255,255,0.3)" />
              </button>

              {/* My church — member */}
              <button
                onClick={handleMember}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '16px 18px', borderRadius: 16, cursor: 'pointer',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-light)',
                  textAlign: 'left', width: '100%',
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: 'var(--primary-bg)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontSize: 22 }}>⛪</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 3 }}>
                    Я з конкретної церкви
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.4 }}>
                    Хочу слідкувати за своєю спільнотою
                  </p>
                </div>
                <ChevronRight size={16} color="var(--text-tertiary)" />
              </button>

              {/* Visitor / browse */}
              <button
                onClick={handleVisitor}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '16px 18px', borderRadius: 16, cursor: 'pointer',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-light)',
                  textAlign: 'left', width: '100%',
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: 'rgba(201,169,110,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontSize: 22 }}>🌍</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 3 }}>
                    Просто дивлюся
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.4 }}>
                    Хочу познайомитись із церквами світу
                  </p>
                </div>
                <ChevronRight size={16} color="var(--text-tertiary)" />
              </button>
            </motion.div>

            <motion.p variants={fadeUp} style={{ fontSize: 11, color: 'var(--text-tertiary)', textAlign: 'center', lineHeight: 1.5 }}>
              Kairos — мережа лише за запрошенням.{'\n'}Кожна церква з'являється через особисте знайомство.
            </motion.p>
          </motion.div>
        )}

        {/* ── Step 2: church selector ── */}
        {step === 'church' && (
          <motion.div
            key="church"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            <button
              onClick={() => setStep('choose')}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                fontSize: 13, color: 'var(--primary)', fontWeight: 600,
                cursor: 'pointer', alignSelf: 'flex-start',
              }}
            >
              ← Назад
            </button>
            <ChurchSelector onSelect={handleChurchSelect} />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
