import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserPlus, Crown, ArrowRight, Globe } from 'lucide-react';
import { hapticFeedback } from '@/lib/telegram';
import { useUserStore } from '@/store/userStore';
import { churchLocations } from '@/data/churches';

export function WelcomePage() {
  const navigate = useNavigate();
  const { completeOnboarding } = useUserStore();
  const [step, setStep] = useState<'welcome' | 'role' | 'church'>('welcome');

  const handleRoleSelect = (role: 'visitor' | 'member' | 'pastor') => {
    hapticFeedback('medium');
    if (role === 'visitor') {
      completeOnboarding('visitor');
      navigate('/world');
    } else if (role === 'pastor') {
      completeOnboarding('pastor');
      navigate('/invite-flow');
    } else {
      setStep('church');
    }
  };

  const handleChurchSelect = (id: string) => {
    hapticFeedback('light');
    completeOnboarding('member', id);
    navigate('/');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0F1A',
      color: 'white',
      overflow: 'hidden',
      position: 'relative',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Subtle background grid */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(#1a253f 0.8px, transparent 1px)',
        backgroundSize: '4px 4px',
        opacity: 0.4
      }} />

      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '32px 24px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #5E9ED6, #3A7BC8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Globe size={18} color="white" />
            </div>
            <span style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.5px' }}>Kairos</span>
          </div>

          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>EN</div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 24px 48px' }}>
          <AnimatePresence mode="wait">
            {/* WELCOME SCREEN */}
            {step === 'welcome' && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                style={{ maxWidth: 380, margin: '0 auto', textAlign: 'center' }}
              >
                <div style={{ marginBottom: 48 }}>
                  <div style={{
                    width: 80,
                    height: 80,
                    borderRadius: 24,
                    background: 'linear-gradient(135deg, #5E9ED6, #3A7BC8)',
                    margin: '0 auto 32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 60px -10px #5E9ED6'
                  }}>
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: 16,
                      background: 'rgba(255,255,255,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Globe size={24} color="white" />
                    </div>
                  </div>

                  <h1 style={{
                    fontSize: 42,
                    fontWeight: 700,
                    lineHeight: 1.05,
                    letterSpacing: '-1.5px',
                    marginBottom: 16
                  }}>
                    Церква<br />для всіх<br />народів
                  </h1>

                  <p style={{
                    fontSize: 17,
                    color: 'rgba(255,255,255,0.65)',
                    maxWidth: 260,
                    margin: '0 auto',
                    lineHeight: 1.4
                  }}>
                    Мережа, де ти можеш рости, служити і жити разом
                  </p>
                </div>

                <button
                  onClick={() => { hapticFeedback('medium'); setStep('role'); }}
                  style={{
                    width: '100%',
                    background: 'white',
                    color: '#0A0F1A',
                    fontSize: 17,
                    fontWeight: 600,
                    padding: '18px 24px',
                    borderRadius: 20,
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                  }}
                >
                  Почати
                </button>

                <p style={{ marginTop: 20, fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
                  Приєднуйся до тисяч віруючих по всьому світу
                </p>
              </motion.div>
            )}

            {/* ROLE SELECTION */}
            {step === 'role' && (
              <motion.div
                key="role"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ maxWidth: 380, margin: '0 auto', width: '100%' }}
              >
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                  <div style={{ fontSize: 11, letterSpacing: '2px', color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>ОБЕРІТЬ СВІЙ ШЛЯХ</div>
                  <h2 style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.5px' }}>Як ви хочете приєднатися?</h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {/* Visitor */}
                  <button
                    onClick={() => handleRoleSelect('visitor')}
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 20,
                      padding: '22px 24px',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                      <div style={{
                        width: 48,
                        height: 48,
                        borderRadius: 14,
                        background: 'rgba(255,255,255,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Users size={22} color="#5E9ED6" />
                      </div>
                      <div>
                        <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>Гість</div>
                        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.35 }}>Дивитись події, читати Біблію, досліджувати мережу церков</div>
                      </div>
                    </div>
                  </button>

                  {/* Member */}
                  <button
                    onClick={() => handleRoleSelect('member')}
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 20,
                      padding: '22px 24px',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                      <div style={{
                        width: 48,
                        height: 48,
                        borderRadius: 14,
                        background: 'rgba(255,255,255,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <UserPlus size={22} color="#5E9ED6" />
                      </div>
                      <div>
                        <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>Учасник церкви</div>
                        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.35 }}>Повний доступ до розкладу, подій та спільноти</div>
                      </div>
                    </div>
                  </button>

                  {/* Pastor */}
                  <button
                    onClick={() => handleRoleSelect('pastor')}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #C9A96E, #B38A4F)',
                      border: 'none',
                      borderRadius: 20,
                      padding: '22px 24px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      color: 'black'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                      <div style={{
                        width: 48,
                        height: 48,
                        borderRadius: 14,
                        background: 'rgba(0,0,0,0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Crown size={22} color="black" />
                      </div>
                      <div>
                        <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>Пастор / Служитель</div>
                        <div style={{ fontSize: 14, color: 'rgba(0,0,0,0.65)', lineHeight: 1.35 }}>Керуйте церквою, запрошуйте людей, ведіть статистику</div>
                      </div>
                    </div>
                  </button>
                </div>

                <button
                  onClick={() => setStep('welcome')}
                  style={{ marginTop: 28, color: 'rgba(255,255,255,0.45)', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  ← Назад
                </button>
              </motion.div>
            )}

            {/* CHURCH SELECTOR */}
            {step === 'church' && (
              <motion.div
                key="church"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ maxWidth: 380, margin: '0 auto', width: '100%' }}
              >
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                  <h2 style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.5px' }}>Оберіть вашу церкву</h2>
                  <p style={{ color: 'rgba(255,255,255,0.55)', marginTop: 8 }}>Ми знайдемо найближчу до вас</p>
                </div>

                <div style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 20,
                  padding: 8,
                  maxHeight: 380,
                  overflowY: 'auto'
                }}>
                  {churchLocations.slice(0, 10).map((church) => (
                    <button
                      key={church.id}
                      onClick={() => handleChurchSelect(church.id)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                        padding: '14px 16px',
                        borderRadius: 14,
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <div style={{
                        width: 46,
                        height: 46,
                        borderRadius: 12,
                        background: 'linear-gradient(135deg, #1a3a5c, #2d5a8e)',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 13,
                        fontWeight: 700
                      }}>
                        {church.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 15, fontWeight: 600 }}>{church.name}</div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>
                          {church.city}, {church.country}
                        </div>
                      </div>
                      <ArrowRight size={18} color="rgba(255,255,255,0.4)" />
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setStep('role')}
                  style={{ marginTop: 20, color: 'rgba(255,255,255,0.45)', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  ← Назад до вибору ролі
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div style={{ textAlign: 'center', paddingBottom: 28, fontSize: 10, color: 'rgba(255,255,255,0.25)', letterSpacing: '1px' }}>
          KAIROS • AMSTERDAM • 2026
        </div>
      </div>
    </div>
  );
}
