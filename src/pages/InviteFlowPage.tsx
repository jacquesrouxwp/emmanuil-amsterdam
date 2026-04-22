import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { hapticFeedback } from '@/lib/telegram';
import { useUserStore } from '@/store/userStore';
import { verifyInvitation, redeemInvitation } from '@/lib/api';

type Step = 'token' | 'verifying' | 'form' | 'success' | 'error';

const INPUT = {
  width: '100%', padding: '12px 14px', borderRadius: 12, fontSize: 15,
  border: '1px solid var(--border-light)', background: 'var(--bg-secondary)',
  color: 'var(--text-primary)',
} as const;

const LABEL = {
  fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)',
  display: 'block', marginBottom: 6, letterSpacing: 0.3,
} as const;

export function InviteFlowPage() {
  const navigate = useNavigate();
  const { token: urlToken } = useParams<{ token?: string }>();
  const { completeOnboarding } = useUserStore();

  const [step, setStep] = useState<Step>('token');
  const [token, setToken] = useState(urlToken || '');
  const [inviteInfo, setInviteInfo] = useState<{ invitedBy: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [saving, setSaving] = useState(false);

  // Form fields
  const [churchName, setChurchName] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [denomination, setDenomination] = useState('');
  const [pastorName, setPastorName] = useState('');
  const [pastorHistory, setPastorHistory] = useState('');
  const [telegram, setTelegram] = useState('');

  // Auto-verify if token came from URL
  useEffect(() => {
    if (urlToken) handleVerify(urlToken);
  }, []);

  async function handleVerify(t?: string) {
    const tok = (t || token).trim();
    if (!tok) return;
    setStep('verifying');
    try {
      const result = await verifyInvitation(tok);
      if (result.valid) {
        setInviteInfo({ invitedBy: result.invitedBy || 'Emmanuil Amsterdam' });
        setToken(tok);
        setStep('form');
      } else {
        setErrorMsg(result.reason || 'Запрошення недійсне або вже використане');
        setStep('error');
      }
    } catch {
      setErrorMsg('Не вдалося перевірити запрошення. Перевірте інтернет-з\'єднання.');
      setStep('error');
    }
  }

  async function handleSubmit() {
    if (!churchName || !city || !pastorName) return;
    setSaving(true);
    hapticFeedback('medium');
    try {
      // Auto-generate slug from church name + city
      const slug = `${churchName} ${city}`
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .slice(0, 40) || `church-${Date.now()}`;

      // TEST token — bypass real server
      if (token === 'TEST-INVITE-2024') {
        const testSecret = 'test-secret-' + Date.now();
        localStorage.setItem('emmanuil_admin_secret', testSecret);
        completeOnboarding('pastor', slug);
        setStep('success');
        return;
      }

      const result = await redeemInvitation(token, {
        slug,
        name: churchName,
        city,
        country: country || 'Україна',
        denomination,
        pastor: pastorName,
        pastorBio: pastorHistory || `Пастор ${pastorName}`,
        pastorEmail: telegram || `pastor@${slug}.kairos`,
        telegram,
        lat: 0,
        lng: 0,
      });

      if (result.adminSecret) localStorage.setItem('emmanuil_admin_secret', result.adminSecret);
      const cId = result.church?.slug || slug;
      completeOnboarding('pastor', cId);
      setStep('success');
    } catch (e: any) {
      setErrorMsg(e?.message || 'Не вдалося зареєструвати церкву. Спробуйте ще раз.');
      setStep('error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{
      minHeight: '100%', display: 'flex', flexDirection: 'column',
      padding: '32px 24px 48px', background: 'var(--bg)',
      overflowY: 'auto',
    }}>
      <AnimatePresence mode="wait">

        {/* ── Step: enter token ── */}
        {step === 'token' && (
          <motion.div key="token"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 400, margin: '0 auto', width: '100%' }}
          >
            <div>
              <button onClick={() => navigate('/welcome')}
                style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', marginBottom: 24 }}>
                ← Назад
              </button>
              <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.5, marginBottom: 10 }}>
                🎟️ Запрошення пастора
              </h1>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 10 }}>
                Кожна церква в Kairos з'являється через особисте запрошення від іншого пастора.
              </p>
              <p style={{ fontSize: 13, color: 'var(--text-tertiary)', lineHeight: 1.65 }}>
                Це не формальність — це ланцюжок довіри. Ми будуємо мости між служителями по всьому світу, щоб знати одне одного особисто, ділитися досвідом і бачити як тепло Христове діє в різних народах і культурах. Пряме знайомство — наш захист від ізоляції та помилок.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={LABEL}>Посилання або код</label>
              <input
                value={token}
                onChange={(e) => {
                  // Extract token from full URL if pasted
                  const val = e.target.value;
                  const match = val.match(/\/invite\/([^/?]+)/);
                  setToken(match ? match[1] : val);
                }}
                placeholder="https://kairos.app/invite/abc123 або abc123"
                style={{ ...INPUT, fontFamily: 'monospace', fontSize: 13 }}
              />
              {/* Test hint */}
              <p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                Для тесту використайте код:{' '}
                <button onClick={() => setToken('TEST-INVITE-2024')}
                  style={{ color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', fontSize: 11 }}>
                  TEST-INVITE-2024
                </button>
              </p>
            </div>

            <button
              onClick={() => handleVerify()}
              disabled={!token.trim()}
              style={{
                padding: '14px', borderRadius: 14, fontSize: 15, fontWeight: 700,
                background: token.trim() ? 'var(--primary)' : 'var(--bg-secondary)',
                color: token.trim() ? '#fff' : 'var(--text-tertiary)',
                cursor: token.trim() ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              Перевірити запрошення <ChevronRight size={16} />
            </button>
          </motion.div>
        )}

        {/* ── Step: verifying ── */}
        {step === 'verifying' && (
          <motion.div key="verifying"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 16, minHeight: '60vh' }}
          >
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
              <Loader2 size={36} color="var(--primary)" />
            </motion.div>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Перевіряємо запрошення...</p>
          </motion.div>
        )}

        {/* ── Step: registration form ── */}
        {step === 'form' && (
          <motion.div key="form"
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 400, margin: '0 auto', width: '100%' }}
          >
            {/* Invited by banner */}
            {inviteInfo && (
              <div style={{
                padding: '10px 14px', borderRadius: 12,
                background: 'rgba(94,158,214,0.08)',
                border: '1px solid rgba(94,158,214,0.2)',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <CheckCircle2 size={16} color="var(--primary)" />
                <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  Запрошено від: <strong>{inviteInfo.invitedBy}</strong>
                </p>
              </div>
            )}

            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5, marginBottom: 6 }}>
                Розкажіть про церкву
              </h1>
              <p style={{ fontSize: 13, color: 'var(--text-tertiary)', lineHeight: 1.5 }}>
                Ця інформація буде видна іншим церквам у мережі Kairos.
              </p>
            </div>

            {/* Church info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                Про церкву
              </p>

              <div>
                <label style={LABEL}>Назва церкви *</label>
                <input value={churchName} onChange={(e) => setChurchName(e.target.value)}
                  placeholder="Напр. Церква Спасення" style={INPUT} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={LABEL}>Місто *</label>
                  <input value={city} onChange={(e) => setCity(e.target.value)}
                    placeholder="Київ" style={INPUT} />
                </div>
                <div>
                  <label style={LABEL}>Країна</label>
                  <input value={country} onChange={(e) => setCountry(e.target.value)}
                    placeholder="Україна" style={INPUT} />
                </div>
              </div>

              <div>
                <label style={LABEL}>Деномінація</label>
                <input value={denomination} onChange={(e) => setDenomination(e.target.value)}
                  placeholder="Євангельська, Баптистська..." style={INPUT} />
              </div>
            </div>

            {/* Pastor info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                Про пастора
              </p>

              <div>
                <label style={LABEL}>Ваше ім'я *</label>
                <input value={pastorName} onChange={(e) => setPastorName(e.target.value)}
                  placeholder="Ім'я та прізвище" style={INPUT} />
              </div>

              <div>
                <label style={LABEL}>Де служили раніше</label>
                <textarea value={pastorHistory} onChange={(e) => setPastorHistory(e.target.value)}
                  placeholder="Коротко про служіння: де, скільки років, яке служіння..."
                  rows={3}
                  style={{ ...INPUT, resize: 'none', lineHeight: 1.5 }} />
              </div>

              <div>
                <label style={LABEL}>Telegram</label>
                <input value={telegram} onChange={(e) => setTelegram(e.target.value)}
                  placeholder="@username або посилання" style={INPUT} />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={saving || !churchName || !city || !pastorName}
              style={{
                padding: '15px', borderRadius: 14, fontSize: 15, fontWeight: 700,
                background: (churchName && city && pastorName) ? 'var(--primary)' : 'var(--bg-secondary)',
                color: (churchName && city && pastorName) ? '#fff' : 'var(--text-tertiary)',
                cursor: (churchName && city && pastorName) ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              {saving ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                  <Loader2 size={18} />
                </motion.div>
              ) : (
                <>Зареєструвати церкву <ChevronRight size={16} /></>
              )}
            </button>
          </motion.div>
        )}

        {/* ── Step: success ── */}
        {step === 'success' && (
          <motion.div key="success"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 20, textAlign: 'center', minHeight: '70vh' }}
          >
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
            >
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
                Ваша церква з'явилась у мережі Kairos. Тепер ви можете публікувати пости та запрошувати інших.
              </p>
            </div>
            <button
              onClick={() => { hapticFeedback('medium'); navigate('/my-church'); }}
              style={{
                padding: '14px 32px', borderRadius: 14, fontSize: 15, fontWeight: 700,
                background: 'var(--primary)', color: '#fff', cursor: 'pointer',
              }}
            >
              Налаштувати церкву →
            </button>
          </motion.div>
        )}

        {/* ── Step: error ── */}
        {step === 'error' && (
          <motion.div key="error"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 16, textAlign: 'center', minHeight: '60vh' }}
          >
            <AlertCircle size={48} color="#FF3B30" />
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Щось пішло не так</h2>
              <p style={{ fontSize: 14, color: 'var(--text-tertiary)', lineHeight: 1.55, maxWidth: 280 }}>{errorMsg}</p>
            </div>
            <button onClick={() => setStep('token')}
              style={{
                padding: '12px 24px', borderRadius: 12, fontSize: 14, fontWeight: 600,
                background: 'var(--bg-secondary)', border: '1px solid var(--border-light)',
                color: 'var(--text-primary)', cursor: 'pointer',
              }}>
              Спробувати ще раз
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
