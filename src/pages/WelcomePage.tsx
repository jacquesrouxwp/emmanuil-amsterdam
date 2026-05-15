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
  const [selectedRole, setSelectedRole] = useState<'visitor' | 'member' | 'pastor' | null>(null);

  const handleRoleSelect = (role: 'visitor' | 'member' | 'pastor') => {
    hapticFeedback('medium');
    setSelectedRole(role);
    
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
    <div className="min-h-screen bg-[#0A0F1A] text-white overflow-hidden relative">
      {/* Background gradient + subtle grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#1a253f_0.8px,transparent_1px)] bg-[length:4px_4px] opacity-40" />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top bar */}
        <div className="flex justify-between items-center px-6 pt-8 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#5E9ED6] to-[#3A7BC8] flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-xl tracking-tight">Kairos</span>
          </div>
          
          <button 
            onClick={() => hapticFeedback('light')}
            className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <span>EN</span>
            <span className="text-xs">▼</span>
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-center px-6 pb-12">
          <AnimatePresence mode="wait">
            {/* === WELCOME SCREEN === */}
            {step === 'welcome' && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-md mx-auto text-center"
              >
                <div className="mb-10">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-[#5E9ED6] via-[#4A8BC8] to-[#3A7BC8] mb-8 shadow-[0_0_60px_-10px_#5E9ED6]">
                    <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <h1 className="text-6xl font-semibold tracking-tighter mb-4 leading-none">
                    Церква<br /> для всіх<br /> народів
                  </h1>
                  
                  <p className="text-xl text-white/70 max-w-[280px] mx-auto">
                    Мережа, де ти можеш рости, служити і жити разом
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => { hapticFeedback('medium'); setStep('role'); }}
                  className="group w-full bg-white text-[#0A0F1A] font-semibold text-lg py-4 rounded-3xl flex items-center justify-center gap-3 shadow-xl active:scale-[0.985] transition-all"
                >
                  Почати
                  <ArrowRight className="group-hover:-rotate-45 transition-transform" />
                </motion.button>

                <p className="mt-6 text-xs text-white/40">
                  Приєднуйся до тисяч віруючих по всьому світу
                </p>
              </motion.div>
            )}

            {/* === ROLE SELECTION === */}
            {step === 'role' && (
              <motion.div
                key="role"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-md mx-auto w-full"
              >
                <div className="text-center mb-10">
                  <div className="text-sm uppercase tracking-[3px] text-white/50 mb-3">ОБЕРІТЬ СВІЙ ШЛЯХ</div>
                  <h2 className="text-4xl font-semibold tracking-tight">Як ви хочете приєднатися?</h2>
                </div>

                <div className="space-y-4">
                  {/* Visitor */}
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    onClick={() => handleRoleSelect('visitor')}
                    className="w-full group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 backdrop-blur-xl rounded-3xl p-6 text-left transition-all active:scale-[0.985]"
                  >
                    <div className="flex items-start gap-5">
                      <div className="mt-1 w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                        <Users className="w-6 h-6 text-[#5E9ED6]" />
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="font-semibold text-2xl tracking-tight">Гість</div>
                        <div className="text-white/60 mt-1 pr-8">Дивитись події, читати Біблію, досліджувати мережу церков</div>
                      </div>
                    </div>
                  </motion.button>

                  {/* Member */}
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    onClick={() => handleRoleSelect('member')}
                    className="w-full group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 backdrop-blur-xl rounded-3xl p-6 text-left transition-all active:scale-[0.985]"
                  >
                    <div className="flex items-start gap-5">
                      <div className="mt-1 w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                        <UserPlus className="w-6 h-6 text-[#5E9ED6]" />
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="font-semibold text-2xl tracking-tight">Учасник церкви</div>
                        <div className="text-white/60 mt-1 pr-8">Повний доступ до розкладу, подій, груп та спільноти</div>
                      </div>
                    </div>
                  </motion.button>

                  {/* Pastor / Leader */}
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    onClick={() => handleRoleSelect('pastor')}
                    className="w-full group bg-gradient-to-br from-[#C9A96E] to-[#B38A4F] text-black hover:brightness-105 border border-white/20 rounded-3xl p-6 text-left transition-all active:scale-[0.985] shadow-[0_10px_40px_-15px_#C9A96E]"
                  >
                    <div className="flex items-start gap-5">
                      <div className="mt-1 w-12 h-12 rounded-2xl bg-black/10 flex items-center justify-center">
                        <Crown className="w-6 h-6" />
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="font-semibold text-2xl tracking-tight">Пастор / Служитель</div>
                        <div className="text-black/70 mt-1 pr-8">Керуйте церквою, запрошуйте людей, ведіть статистику</div>
                      </div>
                    </div>
                  </motion.button>
                </div>

                <button 
                  onClick={() => setStep('welcome')}
                  className="mt-8 text-white/50 hover:text-white text-sm flex items-center gap-2 mx-auto transition-colors"
                >
                  ← Назад
                </button>
              </motion.div>
            )}

            {/* === CHURCH SELECTOR === */}
            {step === 'church' && (
              <motion.div
                key="church"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-md mx-auto w-full"
              >
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-semibold tracking-tight">Оберіть вашу церкву</h2>
                  <p className="text-white/60 mt-3">Ми знайдемо найближчу до вас</p>
                </div>

                <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-3xl p-2 max-h-[420px] overflow-y-auto custom-scroll">
                  {churchLocations.slice(0, 12).map((church, index) => (
                    <button
                      key={church.id}
                      onClick={() => handleChurchSelect(church.id)}
                      className="w-full flex items-center gap-4 px-5 py-4 hover:bg-white/10 rounded-2xl transition-all text-left active:bg-white/15"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1a3a5c] to-[#2d5a8e] flex-shrink-0 flex items-center justify-center text-sm font-bold">
                        {church.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-lg tracking-tight">{church.name}</div>
                        <div className="text-sm text-white/50 flex items-center gap-1.5">
                          <span>{church.city}</span>
                          <span className="text-white/30">•</span>
                          <span>{church.country}</span>
                        </div>
                      </div>
                      <ArrowRight className="text-white/40" />
                    </button>
                  ))}
                </div>

                <button 
                  onClick={() => setStep('role')}
                  className="mt-6 text-white/50 hover:text-white text-sm mx-auto block"
                >
                  ← Назад до вибору ролі
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom subtle text */}
        <div className="text-center pb-8 text-[10px] text-white/30 tracking-widest">
          KAIROS • AMSTERDAM • 2026
        </div>
      </div>
    </div>
  );
}
