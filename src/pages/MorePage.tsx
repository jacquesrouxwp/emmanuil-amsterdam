import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Church, Phone, Share2, Info, ChevronDown, Heart, Shield,
  CreditCard, Landmark, ExternalLink, MapPin, Instagram,
  Eye, BookOpen, Globe, RefreshCw,
} from 'lucide-react';
import { hapticFeedback, shareUrl, openLink } from '@/lib/telegram';
import { useT } from '@/i18n/translations';
import { ChurchStats } from '@/components/shared/ChurchStats';
import { PersonCard } from '@/components/shared/PersonCard';
import { pastors } from '@/data/people';
import { ADMIN_MODE_KEY } from './AdminPage';
import { useUserStore } from '@/store/userStore';

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const TAP_TARGET = 5;
const TAP_WINDOW = 1500;

// ── Accordion row component ───────────────────────────────────────────────────
function AccordionRow({
  icon,
  iconColor,
  iconBg,
  label,
  isOpen,
  onToggle,
  children,
}: {
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  const Icon = icon;
  return (
    <div
      className="card"
      style={{ padding: 0, overflow: 'hidden', marginBottom: 10 }}
    >
      {/* Header row */}
      <button
        onClick={onToggle}
        style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '14px 16px', width: '100%', textAlign: 'left', cursor: 'pointer',
        }}
      >
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: iconBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon size={20} color={iconColor} />
        </div>
        <span style={{ flex: 1, fontSize: 15, fontWeight: 500 }}>{label}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ display: 'flex' }}
        >
          <ChevronDown size={18} color="var(--text-tertiary)" />
        </motion.div>
      </button>

      {/* Collapsible body */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ borderTop: '1px solid var(--border-light)', padding: '14px 16px' }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export function MorePage() {
  const navigate = useNavigate();
  const t = useT();
  const { reset, role, churchId } = useUserStore();

  // ── Admin tap counter ─────────────────────────────────────────────────────
  const tapCount = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [tapProgress, setTapProgress] = useState(0);

  // ── Admin mode state ──────────────────────────────────────────────────────
  const [isAdminMode, setIsAdminMode] = useState(
    () => localStorage.getItem(ADMIN_MODE_KEY) === 'true',
  );

  // ── Accordion open state ──────────────────────────────────────────────────
  const [aboutOpen, setAboutOpen] = useState(false);
  const [contactsOpen, setContactsOpen] = useState(false);
  const [donateOpen, setDonateOpen] = useState(false);

  useEffect(() => {
    tapCount.current = 0;
    setTapProgress(0);
    setIsAdminMode(localStorage.getItem(ADMIN_MODE_KEY) === 'true');

    const onStorage = (e: StorageEvent) => {
      if (e.key === ADMIN_MODE_KEY) setIsAdminMode(e.newValue === 'true');
    };
    const onFocus = () => setIsAdminMode(localStorage.getItem(ADMIN_MODE_KEY) === 'true');
    const onVisible = () => { if (document.visibilityState === 'visible') onFocus(); };

    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      if (tapTimer.current) clearTimeout(tapTimer.current);
      tapTimer.current = null;
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  const registerTap = () => {
    tapCount.current += 1;
    setTapProgress(tapCount.current);
    hapticFeedback('light');

    if (tapTimer.current) clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => {
      tapCount.current = 0;
      setTapProgress(0);
    }, TAP_WINDOW);

    if (tapCount.current >= TAP_TARGET) {
      if (tapTimer.current) { clearTimeout(tapTimer.current); tapTimer.current = null; }
      tapCount.current = 0;
      setTapProgress(0);
      hapticFeedback('medium');
      setTimeout(() => navigate('/admin'), 50);
    }
  };

  const toggle = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    hapticFeedback('light');
    setter((v) => !v);
  };

  return (
    <motion.div className="page" variants={stagger} initial="hidden" animate="show">

      {/* Title row */}
      <motion.div
        variants={fadeUp}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <h1 className="page-title" style={{ margin: 0 }}>{t.more.title}</h1>
        {isAdminMode && (
          <span style={{
            fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 20,
            background: 'rgba(201,169,110,0.15)', color: '#C9A96E',
            border: '1px solid rgba(201,169,110,0.3)', letterSpacing: 0.5,
          }}>
            ADMIN
          </span>
        )}
      </motion.div>
      <motion.div variants={fadeUp}>
        <p className="page-subtitle" style={{ marginTop: 2 }}>Emmanuil Amsterdam</p>
      </motion.div>

      {/* Admin panel shortcut */}
      {isAdminMode && (
        <motion.div variants={fadeUp}>
          <button
            className="card"
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 16px', width: '100%', textAlign: 'left', cursor: 'pointer', marginBottom: 14,
              borderLeft: '3px solid #C9A96E',
            }}
            onClick={() => { hapticFeedback('medium'); navigate('/admin'); }}
          >
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: 'rgba(201,169,110,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Shield size={20} color="#C9A96E" />
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: '#C9A96E' }}>Панель администратора</span>
              <p style={{ fontSize: 12, color: 'var(--text-tertiary)', margin: 0, marginTop: 1 }}>Управление контентом</p>
            </div>
            <ChevronDown size={18} color="#C9A96E" style={{ transform: 'rotate(-90deg)' }} />
          </button>
        </motion.div>
      )}

      {/* Church statistics */}
      <motion.div variants={fadeUp} style={{ marginBottom: 18 }}>
        <ChurchStats />
      </motion.div>

      {/* О церкви — accordion */}
      <motion.div variants={fadeUp}>
        <AccordionRow
          icon={Church}
          iconColor="#C9A96E"
          iconBg="rgba(201,169,110,0.12)"
          label={t.more.aboutChurch}
          isOpen={aboutOpen}
          onToggle={() => toggle(setAboutOpen)}
        >
          {/* Description */}
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 14 }}>
            {t.about.description}
          </p>

          {/* Vision */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <Eye size={15} color="var(--accent-gold)" />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-gold)' }}>{t.about.vision}</span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 14 }}>
            {t.about.visionDesc}
          </p>

          {/* Gospel */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <Globe size={15} color="#34C759" />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#34C759' }}>{t.about.gospel}</span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 14 }}>
            {t.about.gospelDesc}
          </p>

          {/* Pastors */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <BookOpen size={15} color="var(--primary)" />
            <span style={{ fontSize: 13, fontWeight: 600 }}>{t.about.pastor}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
            {pastors.map((person, i) => (
              <PersonCard key={person.id} person={person} index={i} />
            ))}
          </div>

          {/* Location */}
          <button
            className="btn btn--secondary btn--full"
            onClick={() => { hapticFeedback('light'); openLink('https://maps.google.com/?q=Javastraat+118+Amsterdam'); }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            <MapPin size={15} />
            {t.about.openMap}
          </button>
        </AccordionRow>
      </motion.div>

      {/* Контакты — accordion */}
      <motion.div variants={fadeUp}>
        <AccordionRow
          icon={Phone}
          iconColor="#5E9ED6"
          iconBg="rgba(94,158,214,0.12)"
          label={t.more.contacts}
          isOpen={contactsOpen}
          onToggle={() => toggle(setContactsOpen)}
        >
          {/* Pastors with actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
            {pastors.map((p, i) => (
              <PersonCard key={p.id} person={p} index={i} showActions />
            ))}
          </div>

          {/* Social links */}
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {t.contacts.socials}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button
              className="card"
              onClick={() => { hapticFeedback('light'); openLink('https://www.instagram.com/emmanuil.amsterdam'); }}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, textAlign: 'left', cursor: 'pointer' }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Instagram size={18} color="#fff" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 600 }}>Instagram</p>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>@emmanuil.amsterdam</p>
              </div>
              <ExternalLink size={15} color="var(--text-tertiary)" />
            </button>
            <button
              className="card"
              onClick={() => { hapticFeedback('light'); openLink('https://www.instagram.com/chosenyouth_emm'); }}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, textAlign: 'left', cursor: 'pointer' }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Instagram size={18} color="#fff" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 600 }}>Instagram · Молодіжне</p>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>@chosenyouth_emm</p>
              </div>
              <ExternalLink size={15} color="var(--text-tertiary)" />
            </button>
          </div>
        </AccordionRow>
      </motion.div>

      {/* Volunteer button */}
      <motion.div variants={fadeUp}>
        <button
          className="card"
          style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '14px 16px', width: '100%', textAlign: 'left', cursor: 'pointer', marginBottom: 10,
          }}
          onClick={() => { hapticFeedback('medium'); navigate('/volunteer'); }}
        >
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'rgba(239, 68, 68, 0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Heart size={20} color="#EF4444" />
          </div>
          <span style={{ flex: 1, fontSize: 15, fontWeight: 500 }}>{t.more.volunteer}</span>
          <ChevronDown size={18} color="var(--text-tertiary)" style={{ transform: 'rotate(-90deg)' }} />
        </button>
      </motion.div>

      {/* Share */}
      <motion.div variants={fadeUp}>
        <button
          className="card"
          style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '14px 16px', width: '100%', textAlign: 'left', cursor: 'pointer', marginBottom: 10,
          }}
          onClick={() => {
            hapticFeedback('light');
            shareUrl('https://t.me/myconclaw_bot/app', 'Emmanuil Amsterdam — церква в Telegram!');
          }}
        >
          <div style={{
            width: 38, height: 38, borderRadius: 10, background: 'var(--primary-bg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Share2 size={20} color="var(--primary)" />
          </div>
          <span style={{ flex: 1, fontSize: 15, fontWeight: 500 }}>{t.more.share}</span>
          <ChevronDown size={18} color="var(--text-tertiary)" style={{ transform: 'rotate(-90deg)' }} />
        </button>
      </motion.div>

      {/* Пожертвования — accordion, LAST */}
      <motion.div variants={fadeUp}>
        <AccordionRow
          icon={CreditCard}
          iconColor="#00A651"
          iconBg="rgba(0,166,81,0.1)"
          label={t.donate.title}
          isOpen={donateOpen}
          onToggle={() => toggle(setDonateOpen)}
        >
          <p style={{ fontSize: 12, fontStyle: 'italic', color: 'var(--accent-gold)', marginBottom: 12, opacity: 0.9 }}>
            {t.donate.quote} {t.donate.quoteRef}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button
              className="card"
              onClick={() => { hapticFeedback('medium'); openLink('https://www.privat24.ua/'); }}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, textAlign: 'left', cursor: 'pointer' }}
            >
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: 'rgba(0, 166, 81, 0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <CreditCard size={20} color="#00A651" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 600 }}>{t.donate.privatbank}</p>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 1 }}>{t.donate.privatbankDesc}</p>
              </div>
              <ExternalLink size={15} color="var(--text-tertiary)" />
            </button>
            <button
              className="card"
              onClick={() => { hapticFeedback('medium'); openLink('https://www.ideal.nl/'); }}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, textAlign: 'left', cursor: 'pointer' }}
            >
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: 'rgba(204, 0, 102, 0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Landmark size={20} color="#CC0066" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 600 }}>{t.donate.ideal}</p>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 1 }}>{t.donate.idealDesc}</p>
              </div>
              <ExternalLink size={15} color="var(--text-tertiary)" />
            </button>
          </div>
          <div
            className="scripture-card"
            style={{ marginTop: 12 }}
          >
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', fontStyle: 'italic', textAlign: 'center' }}>
              {t.donate.thanks}
            </p>
          </div>
        </AccordionRow>
      </motion.div>

      {/* Version footer — 5 quick taps → admin */}
      <motion.div
        variants={fadeUp}
        style={{ textAlign: 'center', padding: '28px 0 16px', color: 'var(--text-tertiary)' }}
      >
        <Info size={16} style={{ marginBottom: 4, opacity: 0.5 }} />
        <p style={{ fontSize: 12 }}>Emmanuil Amsterdam v1.0.0</p>
        <div
          onPointerDown={(e) => { e.preventDefault(); registerTap(); }}
          style={{
            display: 'inline-block', marginTop: 2, padding: '8px 14px',
            userSelect: 'none', WebkitUserSelect: 'none',
            WebkitTapHighlightColor: 'transparent',
            touchAction: 'manipulation', cursor: 'pointer',
          }}
        >
          <p style={{ fontSize: 11, margin: 0 }}>{t.more.version}</p>
          {tapProgress > 0 && (
            <div style={{
              display: 'flex', gap: 4, justifyContent: 'center', marginTop: 4,
              opacity: tapProgress >= 2 ? 1 : 0, transition: 'opacity 0.15s',
            }}>
              {Array.from({ length: TAP_TARGET }).map((_, i) => (
                <span key={i} style={{
                  width: 5, height: 5, borderRadius: '50%',
                  background: i < tapProgress ? '#C9A96E' : 'rgba(255,255,255,0.15)',
                  transition: 'background 0.1s',
                }} />
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* ── Role switcher (for testing) ─────────────────────────── */}
      <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
        style={{ padding: '4px 16px 32px' }}>
        <div style={{
          padding: '12px 14px', borderRadius: 12,
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-light)',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 2 }}>
              Поточна роль
            </p>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>
              {role === 'pastor' ? '👨‍💼 Пастор' : role === 'member' ? '⛪ Прихожанин' : '🌍 Гість'}
              {churchId ? ` · ${churchId}` : ''}
            </p>
          </div>
          <button
            onClick={() => {
              hapticFeedback('medium');
              reset();
              navigate('/welcome');
            }}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 12px', borderRadius: 10,
              background: 'var(--bg)', border: '1px solid var(--border)',
              fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={13} />
            Змінити роль
          </button>
        </div>
      </motion.div>

    </motion.div>
  );
}
