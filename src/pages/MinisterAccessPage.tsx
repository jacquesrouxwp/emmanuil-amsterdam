import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { hapticFeedback } from '@/lib/telegram';
import { useUserStore } from '@/store/userStore';
import { fetchChurch } from '@/lib/api';

type Step = 'loading' | 'confirm' | 'success' | 'error';

export function MinisterAccessPage() {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const { completeOnboarding } = useUserStore();

  const [step, setStep] = useState<Step>('loading');
  const [churchName, setChurchName] = useState('');
  const [churchId, setChurchId] = useState('');
  const [secret, setSecret] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!token) { setErrorMsg('Посилання недійсне.'); setStep('error'); return; }

    try {
      const decoded = atob(token);
      const [cId, sec] = decoded.split('::');
      if (!cId || !sec) throw new Error('bad format');

      setChurchId(cId);
      setSecret(sec);

      // Завантажуємо інфо про церкву
      fetchChurch(cId).then((ch) => {
        if (!ch) { setErrorMsg('Церкву не знайдено.'); setStep('error'); return; }
        setChurchName(ch.name);
        setStep('confirm');
      });
    } catch {
      setErrorMsg('Посилання пошкоджене або недійсне.');
      setStep('error');
    }
  }, [token]);

  function handleAccept() {
    hapticFeedback('medium');
    localStorage.setItem('emmanuil_admin_secret', secret);
    completeOnboarding('minister', churchId);
    setStep('success');
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '32px 24px 48px', background: 'var(--bg)',
    }}>

      {/* Loading */}
      {step === 'loading' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
            <Loader2 size={36} color="var(--primary)" />
          </motion.div>
          <p style={{ fontSize: 14, color: 'var(--text-tertiary)' }}>Перевіряємо доступ...</p>
        </motion.div>
      )}

      {/* Confirm */}
      {step === 'confirm' && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, textAlign: 'center' }}>

          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'rgba(94,158,214,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Shield size={40} color="var(--primary)" />
          </div>

          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5, marginBottom: 8 }}>
              Запрошення служителя
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              Вас запрошують як служителя церкви
            </p>
            <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginTop: 8 }}>
              {churchName}
            </p>
          </div>

          {/* Що дає роль */}
          <div style={{
            width: '100%', padding: '16px',
            borderRadius: 16, background: 'var(--bg-secondary)',
            border: '1px solid var(--border-light)',
            textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: 0.6 }}>
              ЯК СЛУЖИТЕЛЬ ВИ ЗМОЖЕТЕ:
            </p>
            {[
              '✍️  Публікувати пости від імені церкви',
              '📅  Створювати та редагувати події',
              '🏠  Керувати домашніми групами',
            ].map((item) => (
              <p key={item} style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item}</p>
            ))}
            <div style={{ height: 1, background: 'var(--border-light)', margin: '4px 0' }} />
            <p style={{ fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.5 }}>
              Запрошувати нових пасторів може тільки пастор церкви.
            </p>
          </div>

          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button onClick={handleAccept} style={{
              width: '100%', padding: '15px', borderRadius: 14, fontSize: 15, fontWeight: 700,
              background: 'var(--primary)', color: '#fff', cursor: 'pointer',
            }}>
              Прийняти роль служителя
            </button>
            <button onClick={() => navigate('/welcome')} style={{
              width: '100%', padding: '12px', borderRadius: 14, fontSize: 14, fontWeight: 600,
              background: 'var(--bg-secondary)', border: '1px solid var(--border-light)',
              color: 'var(--text-secondary)', cursor: 'pointer',
            }}>
              Відмовитися
            </button>
          </div>
        </motion.div>
      )}

      {/* Success */}
      {step === 'success' && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, textAlign: 'center' }}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'rgba(52,199,89,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <CheckCircle2 size={44} color="#34C759" />
            </div>
          </motion.div>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>Ласкаво просимо!</h1>
            <p style={{ fontSize: 14, color: 'var(--text-tertiary)', lineHeight: 1.6, maxWidth: 280 }}>
              Тепер ви служитель церкви <strong>{churchName}</strong>. Можете публікувати та керувати контентом.
            </p>
          </div>
          <button onClick={() => { hapticFeedback('medium'); navigate('/my-church'); }}
            style={{
              padding: '14px 32px', borderRadius: 14, fontSize: 15, fontWeight: 700,
              background: 'var(--primary)', color: '#fff', cursor: 'pointer',
            }}>
            Перейти до панелі
          </button>
        </motion.div>
      )}

      {/* Error */}
      {step === 'error' && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center' }}>
          <AlertCircle size={48} color="#FF3B30" />
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Не вдалося приєднатися</h2>
            <p style={{ fontSize: 14, color: 'var(--text-tertiary)', maxWidth: 280, lineHeight: 1.55 }}>{errorMsg}</p>
          </div>
          <button onClick={() => navigate('/welcome')}
            style={{
              padding: '12px 24px', borderRadius: 12, fontSize: 14, fontWeight: 600,
              background: 'var(--bg-secondary)', border: '1px solid var(--border-light)',
              color: 'var(--text-primary)', cursor: 'pointer',
            }}>
            На головну
          </button>
        </motion.div>
      )}

    </div>
  );
}
