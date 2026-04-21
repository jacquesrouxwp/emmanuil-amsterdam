import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Calendar, Home, UserPlus, Settings,
  ExternalLink, ChevronRight, Copy, Check, Loader2,
  Users, Send, X, Shield,
} from 'lucide-react';
import { hapticFeedback } from '@/lib/telegram';
import { useUserStore, canInvite } from '@/store/userStore';
import { fetchChurch, createInvitation, listMyInvitations, type ApiChurch } from '@/lib/api';

// ── Util: генерує minister-access посилання ────────────────────────────────
function makeMinisterLink(churchId: string, secret: string): string {
  const encoded = btoa(`${churchId}::${secret}`);
  const base = window.location.origin + (import.meta.env.BASE_URL || '/');
  return `${base}join/${encoded}`;
}

// ── Копіювати у буфер ──────────────────────────────────────────────────────
function useCopy() {
  const [copied, setCopied] = useState(false);
  const copy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return { copied, copy };
}

// ── Секція «Додати служителя» ──────────────────────────────────────────────
function MinisterSheet({ onClose }: { onClose: () => void }) {
  const { churchId } = useUserStore();
  const secret = localStorage.getItem('emmanuil_admin_secret') || '';
  const link = churchId ? makeMinisterLink(churchId, secret) : '';
  const { copied, copy } = useCopy();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      }}
    >
      {/* Backdrop */}
      <div onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} />

      {/* Sheet */}
      <div style={{
        position: 'relative', zIndex: 1,
        background: 'var(--bg-secondary)',
        borderRadius: '24px 24px 0 0',
        padding: '24px 24px 48px',
        display: 'flex', flexDirection: 'column', gap: 20,
      }}>
        {/* Handle */}
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border-light)', margin: '0 auto' }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.4 }}>Додати служителя</h2>
            <p style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 4 }}>
              Поділіться посиланням з тим, кому довіряєте
            </p>
          </div>
          <button onClick={onClose}
            style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <X size={16} color="var(--text-tertiary)" />
          </button>
        </div>

        {/* Пояснення ролі */}
        <div style={{
          padding: '14px 16px', borderRadius: 14,
          background: 'rgba(94,158,214,0.07)',
          border: '1px solid rgba(94,158,214,0.15)',
          display: 'flex', gap: 12, alignItems: 'flex-start',
        }}>
          <Shield size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
              Що може служитель?
            </p>
            <p style={{ fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.6 }}>
              Публікувати пости, створювати події та домашні групи від імені вашої церкви.
              Запрошувати нових пасторів — лише ви.
            </p>
          </div>
        </div>

        {/* Посилання */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.8, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
            Посилання доступу
          </p>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px 14px', borderRadius: 12,
            background: 'var(--bg)', border: '1px solid var(--border-light)',
          }}>
            <p style={{ flex: 1, fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'monospace', wordBreak: 'break-all', lineHeight: 1.4 }}>
              {link || '— немає доступу —'}
            </p>
            <button
              onClick={() => { hapticFeedback('light'); copy(link); }}
              style={{
                flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 12px', borderRadius: 10, cursor: 'pointer', fontSize: 12, fontWeight: 600,
                background: copied ? 'rgba(52,199,89,0.12)' : 'var(--primary)',
                color: copied ? '#34C759' : '#fff',
                transition: 'all 0.2s',
              }}
            >
              {copied ? <><Check size={13} /> Скопійовано</> : <><Copy size={13} /> Копіювати</>}
            </button>
          </div>
        </div>

        {/* Поділитись через Telegram */}
        <button
          onClick={() => {
            hapticFeedback('medium');
            const text = encodeURIComponent(`Привіт! Я запрошую тебе як служителя нашої церкви в Kairos.\n\nПосилання для входу:\n${link}`);
            window.open(`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${text}`, '_blank');
          }}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            padding: '14px', borderRadius: 14, cursor: 'pointer', fontSize: 14, fontWeight: 700,
            background: 'linear-gradient(135deg, #229ED9, #1a7fad)',
            color: '#fff',
          }}
        >
          <Send size={16} /> Поділитися через Telegram
        </button>

        <p style={{ fontSize: 11, color: 'var(--text-tertiary)', textAlign: 'center', lineHeight: 1.5 }}>
          Посилання не обмежене в часі. Ви можете скинути доступ у будь-який момент змінивши налаштування.
        </p>
      </div>
    </motion.div>
  );
}

// ── Картка пункту меню ─────────────────────────────────────────────────────
function MenuRow({
  icon, label, sublabel, badge, onClick, accent,
}: {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  badge?: number | string;
  onClick: () => void;
  accent?: string;
}) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '14px 16px', borderRadius: 16, cursor: 'pointer',
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border-light)',
      textAlign: 'left', width: '100%',
    }}>
      <div style={{
        width: 42, height: 42, borderRadius: 12, flexShrink: 0,
        background: accent ? `${accent}18` : 'rgba(94,158,214,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{label}</p>
        {sublabel && <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>{sublabel}</p>}
      </div>
      {badge !== undefined && (
        <span style={{
          fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
          background: 'rgba(94,158,214,0.12)', color: 'var(--primary)',
        }}>{badge}</span>
      )}
      <ChevronRight size={15} color="var(--text-tertiary)" />
    </button>
  );
}

// ── Головна сторінка ───────────────────────────────────────────────────────
export function MyChurchPage() {
  const navigate = useNavigate();
  const { role, churchId } = useUserStore();
  const isPastor = canInvite(role);

  const [church, setChurch] = useState<ApiChurch | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMinister, setShowMinister] = useState(false);
  const [inviteCount, setInviteCount] = useState<number>(0);

  const secret = localStorage.getItem('emmanuil_admin_secret') || '';

  useEffect(() => {
    if (!churchId) return;
    setLoading(true);
    Promise.all([
      fetchChurch(churchId),
      isPastor && secret ? listMyInvitations(secret) : Promise.resolve([]),
    ]).then(([ch, invites]) => {
      setChurch(ch);
      if (Array.isArray(invites)) setInviteCount(invites.filter((i) => !i.usedAt).length);
    }).finally(() => setLoading(false));
  }, [churchId, isPastor, secret]);

  if (!churchId || !secret) {
    return (
      <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 }}>
        <p style={{ fontSize: 15, color: 'var(--text-tertiary)', textAlign: 'center' }}>
          Немає доступу до адміністрування церкви.
        </p>
        <button onClick={() => navigate('/welcome')}
          style={{ padding: '12px 24px', borderRadius: 12, background: 'var(--primary)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          На початок
        </button>
      </div>
    );
  }

  return (
    <>
      <div style={{ minHeight: '100%', overflowY: 'auto', background: 'var(--bg)', paddingBottom: 90 }}>

        {/* ── Хедер: обкладинка + назва ─────────────────────────────── */}
        <div style={{ position: 'relative', height: 160, overflow: 'hidden' }}>
          {church?.coverPhoto ? (
            <img src={church.coverPhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              background: 'linear-gradient(135deg, #0d1f33 0%, #1a3a5c 100%)',
            }} />
          )}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.1) 100%)',
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
            padding: '16px 20px',
          }}>
            {loading ? (
              <Loader2 size={20} color="#fff" style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: 600, letterSpacing: 0.6, marginBottom: 4 }}>
                  {isPastor ? 'МОЯ ЦЕРКВА' : 'МОЯ ЦЕРКВА · СЛУЖИТЕЛЬ'}
                </p>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: -0.4 }}>
                  {church?.name || churchId}
                </h1>
                {church && (
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>
                    {church.city}, {church.country}
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* ── Блок «Додати служителя» (тільки пастор) ─────────────── */}
          {isPastor && (
            <motion.button
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              onClick={() => { hapticFeedback('medium'); setShowMinister(true); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '16px 18px', borderRadius: 18, cursor: 'pointer',
                background: 'linear-gradient(135deg, #1a3a5c 0%, #0d2a45 100%)',
                border: '1px solid rgba(94,158,214,0.25)',
                textAlign: 'left', width: '100%',
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                background: 'rgba(94,158,214,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <UserPlus size={20} color="var(--primary)" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 3 }}>
                  Додати служителя
                </p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.4 }}>
                  Дайте комусь доступ до ведення сторінки церкви
                </p>
              </div>
              <ChevronRight size={16} color="rgba(255,255,255,0.3)" />
            </motion.button>
          )}

          {/* ── Контент ──────────────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.9, color: 'var(--text-tertiary)', textTransform: 'uppercase', paddingLeft: 4, marginBottom: 4 }}>
              Контент
            </p>

            <MenuRow
              icon={<FileText size={18} color="var(--primary)" />}
              label="Пости"
              sublabel="Публікації від церкви"
              onClick={() => navigate('/my-church/posts')}
              accent="#5e9ed6"
            />
            <MenuRow
              icon={<Calendar size={18} color="#FF9F0A" />}
              label="Події"
              sublabel="Концерти, конференції, збори"
              onClick={() => navigate('/my-church/events')}
              accent="#FF9F0A"
            />
            <MenuRow
              icon={<Home size={18} color="#34C759" />}
              label="Домашні групи"
              sublabel="Малі групи та лідери"
              onClick={() => navigate('/my-church/homegroups')}
              accent="#34C759"
            />
          </div>

          {/* ── Церква ───────────────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.9, color: 'var(--text-tertiary)', textTransform: 'uppercase', paddingLeft: 4, marginBottom: 4 }}>
              Церква
            </p>

            <MenuRow
              icon={<Settings size={18} color="var(--text-secondary)" />}
              label="Профіль церкви"
              sublabel="Назва, опис, фото, контакти"
              onClick={() => navigate('/my-church/profile')}
              accent="#8E8E93"
            />

            {isPastor && (
              <MenuRow
                icon={<Users size={18} color="#C9A96E" />}
                label="Запросити пастора"
                sublabel={inviteCount > 0 ? `${inviteCount} активних запрошень` : 'Поширити мережу Kairos'}
                badge={inviteCount > 0 ? inviteCount : undefined}
                onClick={() => navigate('/my-church/invite-pastor')}
                accent="#C9A96E"
              />
            )}

            <MenuRow
              icon={<ExternalLink size={18} color="var(--text-secondary)" />}
              label="Переглянути сторінку"
              sublabel="Як це бачать інші"
              onClick={() => navigate(`/church/${churchId}`)}
              accent="#8E8E93"
            />
          </div>

        </div>
      </div>

      {/* ── Bottom Sheet: Служитель ───────────────────────────────────── */}
      <AnimatePresence>
        {showMinister && <MinisterSheet onClose={() => setShowMinister(false)} />}
      </AnimatePresence>
    </>
  );
}
