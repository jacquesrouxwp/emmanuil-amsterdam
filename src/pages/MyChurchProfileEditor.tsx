import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronLeft, Save, Loader2, CheckCircle2,
  Image, MapPin, Globe, Instagram, Send,
  Clock, AlignLeft, BookOpen,
} from 'lucide-react';
import { hapticFeedback } from '@/lib/telegram';
import { useUserStore } from '@/store/userStore';
import { fetchChurch, updateChurch, type ApiChurch } from '@/lib/api';

// ── Стилі ──────────────────────────────────────────────────────────────────
const INPUT: React.CSSProperties = {
  width: '100%', padding: '12px 14px', borderRadius: 12, fontSize: 14,
  border: '1px solid var(--border-light)', background: 'var(--bg-secondary)',
  color: 'var(--text-primary)', lineHeight: 1.5,
};
const LABEL: React.CSSProperties = {
  fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)',
  display: 'block', marginBottom: 6, letterSpacing: 0.8, textTransform: 'uppercase',
};
const SECTION: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', gap: 14,
  padding: '18px 16px', borderRadius: 18,
  background: 'var(--bg-secondary)', border: '1px solid var(--border-light)',
};
const SECTION_TITLE: React.CSSProperties = {
  fontSize: 12, fontWeight: 700, letterSpacing: 0.8,
  color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 2,
};

function Field({
  label, icon, children,
}: { label: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ ...LABEL, display: 'flex', alignItems: 'center', gap: 6 }}>
        {icon} {label}
      </label>
      {children}
    </div>
  );
}

// ── Прев'ю обкладинки ──────────────────────────────────────────────────────
function CoverPreview({ url, name }: { url: string; name: string }) {
  if (!url) return null;
  return (
    <div style={{ position: 'relative', height: 120, borderRadius: 14, overflow: 'hidden', marginBottom: 4 }}>
      <img src={url} alt="cover"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
      />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)',
        display: 'flex', alignItems: 'flex-end', padding: '10px 14px',
      }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{name}</p>
      </div>
    </div>
  );
}

// ── Головний компонент ─────────────────────────────────────────────────────
export function MyChurchProfileEditor() {
  const navigate = useNavigate();
  const { churchId } = useUserStore();
  const secret = localStorage.getItem('emmanuil_admin_secret') || '';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // ── Поля форми ────────────────────────────────────────────────────────────
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
  const [denomination, setDenomination] = useState('');
  const [description, setDescription] = useState('');
  const [schedule, setSchedule] = useState('');
  const [pastor, setPastor] = useState('');
  const [pastorBio, setPastorBio] = useState('');
  const [coverPhoto, setCoverPhoto] = useState('');
  const [telegram, setTelegram] = useState('');
  const [instagram, setInstagram] = useState('');
  const [website, setWebsite] = useState('');

  // ── Завантажити поточні дані ───────────────────────────────────────────────
  useEffect(() => {
    if (!churchId) return;
    fetchChurch(churchId).then((ch) => {
      if (!ch) return;
      setName(ch.name || '');
      setCity(ch.city || '');
      setCountry(ch.country || '');
      setAddress(ch.address || '');
      setDenomination(ch.denomination || '');
      setDescription(ch.description || '');
      setSchedule(ch.schedule || '');
      setPastor(ch.pastor || '');
      setPastorBio(ch.pastorBio || '');
      setCoverPhoto(ch.coverPhoto || '');
      setTelegram(ch.telegram || '');
      setInstagram(ch.instagram || '');
      setWebsite(ch.website || '');
    }).finally(() => setLoading(false));
  }, [churchId]);

  // ── Зберегти ──────────────────────────────────────────────────────────────
  async function handleSave() {
    if (!churchId || !name || !city) return;
    setSaving(true);
    setError('');
    hapticFeedback('medium');

    const payload: Partial<Omit<ApiChurch, 'slug'>> = {
      name, city, country, address, denomination,
      description, schedule, pastor, pastorBio,
      coverPhoto, telegram, instagram, website,
    };

    try {
      await updateChurch(secret, churchId, payload);
      setSaved(true);
      hapticFeedback('light');
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      setError(e.message || 'Не вдалося зберегти. Спробуйте ще раз.');
    } finally {
      setSaving(false);
    }
  }

  // ── Рендер ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ minHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
          <Loader2 size={32} color="var(--primary)" />
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100%', overflowY: 'auto', background: 'var(--bg)', paddingBottom: 100 }}>

      {/* ── Sticky header ─────────────────────────────────────────── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'var(--bg)', borderBottom: '1px solid var(--border-light)',
        padding: '14px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <button onClick={() => navigate('/my-church')}
          style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}>
          <ChevronLeft size={18} /> Назад
        </button>
        <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Профіль церкви</p>
        <button
          onClick={handleSave}
          disabled={saving || !name || !city}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 700,
            background: saved ? 'rgba(52,199,89,0.15)' : (name && city) ? 'var(--primary)' : 'var(--bg-secondary)',
            color: saved ? '#34C759' : (name && city) ? '#fff' : 'var(--text-tertiary)',
            cursor: (name && city && !saving) ? 'pointer' : 'default',
            transition: 'all 0.2s',
          }}
        >
          {saving ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
              <Loader2 size={14} />
            </motion.div>
          ) : saved ? (
            <><CheckCircle2 size={14} /> Збережено</>
          ) : (
            <><Save size={14} /> Зберегти</>
          )}
        </button>
      </div>

      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* ── Помилка ─────────────────────────────────────────────── */}
        {error && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            style={{ padding: '12px 16px', borderRadius: 12, background: 'rgba(255,59,48,0.1)', border: '1px solid rgba(255,59,48,0.2)' }}>
            <p style={{ fontSize: 13, color: '#FF3B30' }}>{error}</p>
          </motion.div>
        )}

        {/* ── Обкладинка ──────────────────────────────────────────── */}
        <div style={SECTION}>
          <p style={SECTION_TITLE}>Обкладинка</p>
          <CoverPreview url={coverPhoto} name={name} />
          <Field label="URL фото обкладинки" icon={<Image size={11} />}>
            <input
              value={coverPhoto}
              onChange={(e) => setCoverPhoto(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              style={INPUT}
            />
          </Field>
          <p style={{ fontSize: 11, color: 'var(--text-tertiary)', lineHeight: 1.5 }}>
            Вставте пряме посилання на фото (unsplash, Google Drive, Cloudinary тощо). Рекомендований розмір: 1280×720.
          </p>
        </div>

        {/* ── Основна інформація ──────────────────────────────────── */}
        <div style={SECTION}>
          <p style={SECTION_TITLE}>Основна інформація</p>

          <Field label="Назва церкви *">
            <input value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Церква Спасення" style={INPUT} />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Field label="Місто *" icon={<MapPin size={11} />}>
              <input value={city} onChange={(e) => setCity(e.target.value)}
                placeholder="Київ" style={INPUT} />
            </Field>
            <Field label="Країна">
              <input value={country} onChange={(e) => setCountry(e.target.value)}
                placeholder="Україна" style={INPUT} />
            </Field>
          </div>

          <Field label="Адреса" icon={<MapPin size={11} />}>
            <input value={address} onChange={(e) => setAddress(e.target.value)}
              placeholder="вул. Хрещатик 1" style={INPUT} />
          </Field>

          <Field label="Деномінація" icon={<BookOpen size={11} />}>
            <input value={denomination} onChange={(e) => setDenomination(e.target.value)}
              placeholder="Євангельська, Баптистська..." style={INPUT} />
          </Field>

          <Field label="Розклад служінь" icon={<Clock size={11} />}>
            <input value={schedule} onChange={(e) => setSchedule(e.target.value)}
              placeholder="Неділя 10:00 та 18:00" style={INPUT} />
          </Field>

          <Field label="Опис церкви" icon={<AlignLeft size={11} />}>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Розкажіть про вашу громаду, її серце та місію..."
              rows={4}
              style={{ ...INPUT, resize: 'none' }}
            />
          </Field>
        </div>

        {/* ── Пастор ──────────────────────────────────────────────── */}
        <div style={SECTION}>
          <p style={SECTION_TITLE}>Пастор</p>

          <Field label="Ім'я пастора">
            <input value={pastor} onChange={(e) => setPastor(e.target.value)}
              placeholder="Ім'я та прізвище" style={INPUT} />
          </Field>

          <Field label="Служіння та досвід">
            <textarea
              value={pastorBio}
              onChange={(e) => setPastorBio(e.target.value)}
              placeholder="Де служили, скільки років в служінні, яке серце несете..."
              rows={3}
              style={{ ...INPUT, resize: 'none' }}
            />
          </Field>
        </div>

        {/* ── Контакти і соцмережі ─────────────────────────────────── */}
        <div style={SECTION}>
          <p style={SECTION_TITLE}>Контакти</p>

          <Field label="Telegram" icon={<Send size={11} />}>
            <input value={telegram} onChange={(e) => setTelegram(e.target.value)}
              placeholder="@church_username або t.me/..." style={INPUT} />
          </Field>

          <Field label="Instagram" icon={<Instagram size={11} />}>
            <input value={instagram} onChange={(e) => setInstagram(e.target.value)}
              placeholder="@church.name" style={INPUT} />
          </Field>

          <Field label="Веб-сайт" icon={<Globe size={11} />}>
            <input value={website} onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://church.org" style={INPUT} />
          </Field>
        </div>

        {/* ── Кнопка знизу (дублює хедер для зручності) ──────────── */}
        <button
          onClick={handleSave}
          disabled={saving || !name || !city}
          style={{
            padding: '15px', borderRadius: 14, fontSize: 15, fontWeight: 700,
            background: (name && city) ? 'var(--primary)' : 'var(--bg-secondary)',
            color: (name && city) ? '#fff' : 'var(--text-tertiary)',
            cursor: (name && city && !saving) ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          {saving ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
              <Loader2 size={18} />
            </motion.div>
          ) : saved ? (
            <><CheckCircle2 size={18} color="#34C759" /> Збережено!</>
          ) : (
            <><Save size={18} /> Зберегти профіль</>
          )}
        </button>

      </div>
    </div>
  );
}
