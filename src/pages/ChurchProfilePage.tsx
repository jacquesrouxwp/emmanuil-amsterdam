import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, MapPin, CheckCircle2, Globe, Instagram,
  Users, Church, ExternalLink, Share2,
  HandHeart, ChevronDown, Plus, UserCircle2,
} from 'lucide-react';
import { hapticFeedback, openLink, shareUrl } from '@/lib/telegram';
import { BlogFeed } from '@/components/shared/BlogFeed';
import { churchLocations } from '@/data/churches';
import { useT } from '@/i18n/translations';
import { useAdminChurch, canEditChurch } from '@/hooks/useAdminChurch';

const fadeUp = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

// Placeholder posts for non-Emmanuil churches
function PlaceholderFeed({ church }: { church: typeof churchLocations[0] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {[1, 2].map((i) => (
        <div key={i} className="card" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'var(--primary-bg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Church size={18} color="var(--primary)" />
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600 }}>{church.name}</p>
              <p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                {i === 1 ? '2 дні тому' : '1 тиждень тому'}
              </p>
            </div>
          </div>
          <div style={{ height: 12, background: 'var(--bg-secondary)', borderRadius: 6, marginBottom: 8, width: '85%' }} />
          <div style={{ height: 12, background: 'var(--bg-secondary)', borderRadius: 6, marginBottom: 8, width: '70%' }} />
          <div style={{ height: 12, background: 'var(--bg-secondary)', borderRadius: 6, width: '55%' }} />
        </div>
      ))}
      <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-tertiary)', padding: '8px 0' }}>
        Церква ще не підключена до платформи
      </p>
    </div>
  );
}

export function ChurchProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const t = useT();
  const { churchId: adminChurchId } = useAdminChurch();
  const [moreOpen, setMoreOpen] = useState(false);

  const church = churchLocations.find((c) => c.id === id);
  const canEdit = church ? canEditChurch(adminChurchId, church.id) : false;

  if (!church) {
    return (
      <div className="page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <Church size={48} color="var(--text-tertiary)" />
        <p style={{ fontSize: 16, color: 'var(--text-secondary)' }}>Церква не знайдена</p>
        <button className="btn btn--secondary" onClick={() => navigate(-1)}>Назад</button>
      </div>
    );
  }

  const isOurChurch = church.id === 'emmanuil-amsterdam';

  return (
    <motion.div
      className="page"
      style={{ padding: 0, paddingBottom: 'calc(var(--bottom-nav-height) + 20px)' }}
      variants={stagger} initial="hidden" animate="show"
    >
      {/* ── Cover + back ─────────────────────────────────────────── */}
      <motion.div variants={fadeUp} style={{ position: 'relative' }}>
        {/* Cover photo */}
        <div style={{
          height: 180, width: '100%',
          background: church.coverPhoto
            ? `url(${church.coverPhoto}) center/cover no-repeat`
            : 'linear-gradient(135deg, #1a3a5c 0%, #2d5a8e 50%, #1a3a5c 100%)',
          position: 'relative',
        }}>
          {/* Gradient overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.6) 100%)',
          }} />

          {/* Back button */}
          <button
            onClick={() => { hapticFeedback('light'); navigate(-1); }}
            style={{
              position: 'absolute', top: 16, left: 16,
              width: 36, height: 36, borderRadius: '50%',
              background: 'rgba(0,0,0,0.45)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', backdropFilter: 'blur(8px)',
            }}
          >
            <ArrowLeft size={18} color="#fff" />
          </button>

          {/* Share */}
          <button
            onClick={() => {
              hapticFeedback('light');
              shareUrl(
                `${window.location.origin}/church/${church.id}`,
                church.name,
              );
            }}
            style={{
              position: 'absolute', top: 16, right: 16,
              width: 36, height: 36, borderRadius: '50%',
              background: 'rgba(0,0,0,0.45)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', backdropFilter: 'blur(8px)',
            }}
          >
            <Share2 size={16} color="#fff" />
          </button>
        </div>

        {/* Church avatar */}
        <div style={{ position: 'absolute', bottom: -28, left: 20 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18,
            background: 'linear-gradient(135deg, #1a3a5c 0%, #2d5a8e 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '3px solid var(--bg)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          }}>
            <Church size={30} color="#fff" />
          </div>
        </div>
      </motion.div>

      {/* ── Header info ──────────────────────────────────────────── */}
      <motion.div variants={fadeUp} style={{ padding: '38px 20px 0' }}>
        {/* Name + verified */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.4 }}>{church.name}</h1>
          {church.verified && (
            <CheckCircle2 size={18} color="#5E9ED6" fill="rgba(94,158,214,0.15)" />
          )}
        </div>

        {/* Location */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 10 }}>
          <MapPin size={13} color="var(--text-tertiary)" />
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            {church.city}, {church.country}
          </span>
          {church.denomination && (
            <>
              <span style={{ color: 'var(--text-tertiary)', fontSize: 12 }}>·</span>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{church.denomination}</span>
            </>
          )}
        </div>

        {/* Description */}
        {church.description && (
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 14 }}>
            {church.description}
          </p>
        )}

        {/* ── Key people cards: Pastor + Ministers ──────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          {/* Pastor card */}
          {church.pastor && (
            <div className="card" style={{
              padding: 14, display: 'flex', alignItems: 'center', gap: 12,
              background: 'linear-gradient(135deg, rgba(94,158,214,0.08) 0%, rgba(94,158,214,0.02) 100%)',
              border: '1px solid rgba(94,158,214,0.18)',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: 'linear-gradient(135deg, #5E9ED6, #89BBE5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                overflow: 'hidden',
              }}>
                {church.pastorPhoto ? (
                  <img src={church.pastorPhoto} alt={church.pastor} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <UserCircle2 size={26} color="#fff" />
                )}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.5, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 2 }}>
                  Пастор
                </p>
                <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {church.pastor}
                </p>
              </div>
            </div>
          )}

          {/* Ministers card (placeholder: 4 for Emmanuil, empty for others) */}
          <div className="card" style={{
            padding: 14, display: 'flex', alignItems: 'center', gap: 12,
            background: 'linear-gradient(135deg, rgba(201,169,110,0.08) 0%, rgba(201,169,110,0.02) 100%)',
            border: '1px solid rgba(201,169,110,0.18)',
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'linear-gradient(135deg, #C9A96E, #D9BA7C)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <HandHeart size={22} color="#fff" />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.5, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 2 }}>
                Служителі
              </p>
              <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
                {church.id === 'emmanuil-amsterdam' ? '12' : '—'}
                <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-tertiary)', marginLeft: 4 }}>
                  осіб
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Social links */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          {church.telegram && (
            <button
              onClick={() => { hapticFeedback('medium'); openLink(church.telegram!); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 14px', borderRadius: 20,
                background: 'linear-gradient(135deg, #1a3a5c, #2d5a8e)',
                color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.941z"/>
              </svg>
              Telegram
            </button>
          )}
          {church.instagram && (
            <button
              onClick={() => { hapticFeedback('light'); openLink(church.instagram!); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 14px', borderRadius: 20,
                background: 'linear-gradient(135deg, #f09433, #dc2743, #bc1888)',
                color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
            >
              <Instagram size={14} />
              Instagram
            </button>
          )}
          {church.website && (
            <button
              onClick={() => { hapticFeedback('light'); openLink(church.website!); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 14px', borderRadius: 20,
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                color: 'var(--text)', fontSize: 13, fontWeight: 500, cursor: 'pointer',
              }}
            >
              <Globe size={13} />
              Сайт
              <ExternalLink size={11} color="var(--text-tertiary)" />
            </button>
          )}
        </div>

        <div style={{ marginBottom: 16 }} />
      </motion.div>

      {/* ── "More about church" expandable section ──────────────── */}
      {isOurChurch && (
        <motion.div variants={fadeUp} style={{ padding: '0 16px 16px' }}>
          <button
            onClick={() => { hapticFeedback('light'); setMoreOpen((v) => !v); }}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              width: '100%', padding: '12px 14px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-light)',
              borderRadius: 12, cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: 'var(--primary-bg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Users size={15} color="var(--primary)" />
              </div>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                Більше про церкву
              </span>
            </div>
            <motion.div animate={{ rotate: moreOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={16} color="var(--text-tertiary)" />
            </motion.div>
          </button>

          <AnimatePresence initial={false}>
            {moreOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{ paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {/* Attendees — the only remaining stat */}
                  {church.members && (
                    <div className="card" style={{
                      padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12,
                    }}>
                      <div style={{
                        width: 38, height: 38, borderRadius: 10,
                        background: 'var(--primary-bg)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <Users size={18} color="var(--primary)" />
                      </div>
                      <div>
                        <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.5, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 2 }}>
                          Прихожан
                        </p>
                        <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
                          {church.members}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* About the church — self description */}
                  <div className="card" style={{ padding: 14 }}>
                    <p style={{
                      fontSize: 10, fontWeight: 700, letterSpacing: 1,
                      color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 8,
                    }}>
                      Про церкву
                    </p>
                    <p style={{
                      fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6,
                      whiteSpace: 'pre-wrap',
                    }}>
                      {church.description || 'Церква ще не додала опис про себе.'}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* ── Divider ──────────────────────────────────────────────── */}
      <div style={{ height: 1, background: 'var(--border-light)', margin: '4px 0 20px' }} />

      {/* ── Feed ─────────────────────────────────────────────────── */}
      <motion.div variants={fadeUp} style={{ padding: '0 16px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 14,
        }}>
          <p style={{
            fontSize: 11, fontWeight: 700, letterSpacing: 1,
            color: 'var(--text-tertiary)', textTransform: 'uppercase',
          }}>
            Публікації
          </p>
          {canEdit && (
            <button
              onClick={() => { hapticFeedback('medium'); navigate('/admin'); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '6px 12px', borderRadius: 20,
                background: 'var(--primary)',
                border: 'none',
                color: '#fff', fontSize: 12, fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(94,158,214,0.3)',
              }}
            >
              <Plus size={13} strokeWidth={2.5} />
              Публікація
            </button>
          )}
        </div>

        {isOurChurch ? (
          <BlogFeed title="" />
        ) : (
          <PlaceholderFeed church={church} />
        )}
      </motion.div>
    </motion.div>
  );
}
