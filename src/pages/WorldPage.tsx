import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, MapPin, Clock, ExternalLink, Globe2, ChevronRight, User, Rss, Heart, MessageCircle, Church } from 'lucide-react';
import { hapticFeedback, openLink } from '@/lib/telegram';
import { useLang, loc } from '@/i18n/translations';
import { fetchPosts, type ApiPost } from '@/lib/api';
import { churchLocations, type ChurchLocation } from '@/data/churches';

// ── Helpers ───────────────────────────────────────────────────────────────────
const AVATAR_GRADIENTS = [
  ['#1a3a5c', '#2d5a8e'],
  ['#2d5a8e', '#4a7ab5'],
  ['#5E9ED6', '#89BBE5'],
  ['#C9A96E', '#D9BA7C'],
  ['#1a5c3a', '#2d8e5a'],
  ['#5c1a3a', '#8e2d5a'],
];

function churchInitials(name: string) {
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (h < 1) return 'щойно';
  if (h < 24) return `${h}г тому`;
  if (d < 7) return `${d}д тому`;
  return new Date(dateStr).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' });
}

// ── Stories row ───────────────────────────────────────────────────────────────
function StoriesRow({ onInvite }: { onInvite: () => void }) {
  const navigate = useNavigate();
  const connected = churchLocations.slice(0, 8);

  return (
    <div style={{
      display: 'flex', gap: 14, overflowX: 'auto', padding: '4px 16px 12px',
      scrollbarWidth: 'none',
    }}>
      {/* Invite "+" */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flexShrink: 0 }}>
        <button
          onClick={() => { hapticFeedback('light'); onInvite(); }}
          style={{
            width: 52, height: 52, borderRadius: '50%',
            border: '2px dashed var(--border)',
            background: 'var(--bg-secondary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <span style={{ fontSize: 22, color: 'var(--text-tertiary)', lineHeight: 1 }}>+</span>
        </button>
        <span style={{ fontSize: 10, color: 'var(--text-tertiary)', maxWidth: 52, textAlign: 'center', lineHeight: 1.2 }}>
          Запросити
        </span>
      </div>

      {/* Church circles */}
      {connected.map((c, i) => {
        const [from, to] = AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length];
        return (
          <div
            key={c.id}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flexShrink: 0, cursor: 'pointer' }}
            onClick={() => { hapticFeedback('light'); navigate(`/church/${c.id}`); }}
          >
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: `linear-gradient(135deg, ${from}, ${to})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid var(--bg)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#fff', letterSpacing: -0.5 }}>
                {churchInitials(c.name)}
              </span>
            </div>
            <span style={{ fontSize: 10, color: 'var(--text-secondary)', maxWidth: 54, textAlign: 'center', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {c.name.split(' ')[0]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Invite pastor dark card ───────────────────────────────────────────────────
function InvitePastorCard({ onInvite }: { onInvite: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        margin: '0 16px',
        borderRadius: 16,
        padding: '14px 16px',
        background: 'linear-gradient(135deg, #0d1f33 0%, #1a3a5c 100%)',
        border: '1px solid rgba(94,158,214,0.2)',
        display: 'flex', alignItems: 'center', gap: 12,
      }}
    >
      <div style={{
        width: 40, height: 40, borderRadius: 12, flexShrink: 0,
        background: 'rgba(94,158,214,0.15)',
        border: '1px solid rgba(94,158,214,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5E9ED6" strokeWidth="2">
          <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
        </svg>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 2 }}>
          Запросити пастора
        </p>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', lineHeight: 1.3 }}>
          Тільки за запрошенням — ваше коло довіри
        </p>
      </div>
      <button
        onClick={() => { hapticFeedback('medium'); onInvite(); }}
        style={{
          padding: '8px 14px', borderRadius: 20, flexShrink: 0,
          background: '#5E9ED6', color: '#fff',
          fontSize: 12, fontWeight: 700, cursor: 'pointer',
        }}
      >
        Запросити
      </button>
    </motion.div>
  );
}

// ── Post card ─────────────────────────────────────────────────────────────────
function PostCard({ post, church, lang, onChurchClick }: {
  post: ApiPost;
  church: ChurchLocation | undefined;
  lang: string;
  onChurchClick: () => void;
}) {
  const [liked, setLiked] = useState(false);
  const title = loc(post.title, lang as any);
  const body = loc(post.body, lang as any);
  const idx = churchLocations.findIndex((c) => c.id === church?.id);
  const [from, to] = AVATAR_GRADIENTS[Math.max(0, idx) % AVATAR_GRADIENTS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
      style={{ margin: '0 16px', padding: 0, overflow: 'hidden' }}
    >
      {/* Header */}
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px 10px', cursor: 'pointer' }}
        onClick={onChurchClick}
      >
        <div style={{
          width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
          background: `linear-gradient(135deg, ${from}, ${to})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>
            {churchInitials(church?.name || 'CH')}
          </span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
            {church?.pastor || church?.name || 'Пастор'}
          </p>
          <p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
            {church?.name}{church?.city ? ` · ${church.city}` : ''}
          </p>
        </div>
        <span style={{ fontSize: 11, color: 'var(--text-tertiary)', flexShrink: 0 }}>
          {timeAgo(post.date)}
        </span>
      </div>

      {/* Photo */}
      {post.photos?.[0] && (
        <img
          src={post.photos[0]} alt=""
          style={{ width: '100%', maxHeight: 240, objectFit: 'cover', display: 'block' }}
        />
      )}

      {/* Body */}
      <div style={{ padding: '10px 14px 12px' }}>
        {title && (
          <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
            {title}
          </p>
        )}
        {body && (
          <p style={{
            fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6,
            display: '-webkit-box', WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical' as any, overflow: 'hidden',
          }}>
            {body}
          </p>
        )}
      </div>

      {/* Actions */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 18,
        padding: '8px 14px 12px',
        borderTop: '1px solid var(--border-light)',
      }}>
        <button
          onClick={() => { hapticFeedback('light'); setLiked((v) => !v); }}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            color: liked ? '#e05' : 'var(--text-tertiary)', fontSize: 12, fontWeight: 500, cursor: 'pointer',
          }}
        >
          <Heart size={15} fill={liked ? '#e05' : 'none'} stroke={liked ? '#e05' : 'currentColor'} />
          <span>{liked ? 1 : 0}</span>
        </button>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 5,
          color: 'var(--text-tertiary)', fontSize: 12, fontWeight: 500, cursor: 'pointer',
        }}>
          <MessageCircle size={15} /> <span>0</span>
        </button>
        <div style={{ flex: 1 }} />
        <button style={{ color: 'var(--text-tertiary)', cursor: 'pointer' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"/>
          </svg>
        </button>
      </div>
    </motion.div>
  );
}

// ── World feed ────────────────────────────────────────────────────────────────
function WorldFeed() {
  const lang = useLang();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<ApiPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteHint, setShowInviteHint] = useState(false);

  useEffect(() => {
    fetchPosts('*').then((p) => { setPosts(p); setLoading(false); });
  }, []);

  const getChurch = (churchId?: string) =>
    churchLocations.find((c) => c.id === (churchId || 'emmanuil-amsterdam'));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 20 }}>
      {/* Platform header */}
      <div style={{ padding: '14px 16px 4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.8, color: 'var(--text-primary)' }}>
            Kairos
          </h1>
          <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 1 }}>
            Мережа церков · {churchLocations.length} спільнот
          </p>
        </div>
        <div style={{
          width: 8, height: 8, borderRadius: '50%',
          background: '#34C759',
          boxShadow: '0 0 0 3px rgba(52,199,89,0.2)',
        }} />
      </div>

      {/* Stories */}
      <StoriesRow onInvite={() => setShowInviteHint(true)} />

      {/* Invite hint */}
      <AnimatePresence>
        {showInviteHint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 16px' }}>
              <div style={{
                padding: '12px 14px', borderRadius: 12,
                background: 'var(--primary-bg)',
                border: '1px solid rgba(94,158,214,0.2)',
                fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5,
              }}>
                💡 Щоб запросити пастора — надішліть йому посилання або QR-код. Доступно в адмін-панелі після підключення.
                <button
                  onClick={() => setShowInviteHint(false)}
                  style={{ marginLeft: 8, fontSize: 12, color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}
                >
                  Зрозуміло
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section label */}
      <div style={{ padding: '0 16px' }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
          Лента
        </p>
      </div>

      {/* Invite card */}
      <InvitePastorCard onInvite={() => setShowInviteHint(true)} />

      {/* Posts */}
      {loading ? (
        [1, 2, 3].map((i) => (
          <div key={i} className="card" style={{ margin: '0 16px', padding: 16 }}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--bg-secondary)' }} />
              <div style={{ flex: 1 }}>
                <div style={{ height: 12, background: 'var(--bg-secondary)', borderRadius: 6, width: '55%', marginBottom: 6 }} />
                <div style={{ height: 10, background: 'var(--bg-secondary)', borderRadius: 6, width: '35%' }} />
              </div>
            </div>
            <div style={{ height: 11, background: 'var(--bg-secondary)', borderRadius: 6, marginBottom: 6 }} />
            <div style={{ height: 11, background: 'var(--bg-secondary)', borderRadius: 6, width: '75%' }} />
          </div>
        ))
      ) : posts.length === 0 ? (
        <div style={{ padding: '40px 16px', textAlign: 'center' }}>
          <p style={{ fontSize: 32, marginBottom: 12 }}>🕊️</p>
          <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
            Поки тут порожньо
          </p>
          <p style={{ fontSize: 13, color: 'var(--text-tertiary)', lineHeight: 1.5 }}>
            Перші публікації з'являться коли церкви почнуть ділитися своїм життям
          </p>
        </div>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            church={getChurch(post.churchId)}
            lang={lang}
            onChurchClick={() => {
              const church = getChurch(post.churchId);
              if (church) { hapticFeedback('light'); navigate(`/church/${church.id}`); }
            }}
          />
        ))
      )}
    </div>
  );
}

// ── Clustering ────────────────────────────────────────────────────────────────
const CLUSTER_RADIUS = 2.5; // degrees — tune this for zoom feel

interface Cluster {
  id: string;
  lat: number;
  lng: number;
  churches: ChurchLocation[];
  city: string;
  country: string;
}

function buildClusters(churches: ChurchLocation[]): Cluster[] {
  const used = new Set<string>();
  const clusters: Cluster[] = [];

  for (const c of churches) {
    if (used.has(c.id)) continue;
    const nearby = churches.filter((o) => {
      if (used.has(o.id)) return false;
      const dLat = Math.abs(o.lat - c.lat);
      const dLng = Math.abs(o.lng - c.lng);
      return dLat < CLUSTER_RADIUS && dLng < CLUSTER_RADIUS;
    });
    nearby.forEach((o) => used.add(o.id));
    // Centroid
    const lat = nearby.reduce((s, o) => s + o.lat, 0) / nearby.length;
    const lng = nearby.reduce((s, o) => s + o.lng, 0) / nearby.length;
    clusters.push({
      id: c.id,
      lat, lng,
      churches: nearby,
      city: nearby.length === 1 ? nearby[0].city : nearby[0].city,
      country: nearby[0].country,
    });
  }
  return clusters;
}

// ── Component ─────────────────────────────────────────────────────────────────
export function WorldPage() {
  const navigate = useNavigate();
  const [view, setView] = useState<'globe' | 'feed'>('globe');
  const globeRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [globeLoaded, setGlobeLoaded] = useState(false);
  const [GlobeEl, setGlobeEl] = useState<any>(null);
  const [selectedCluster, setSelectedCluster] = useState<Cluster | null>(null);
  const [selectedChurch, setSelectedChurch] = useState<ChurchLocation | null>(null);
  const [search, setSearch] = useState('');
  const [dimensions, setDimensions] = useState({ w: 0, h: 0 });
  const [countries, setCountries] = useState<any[]>([]);

  const clusters = buildClusters(churchLocations);

  const filtered = churchLocations.filter((c) => {
    if (!search) return false;
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.country.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setDimensions({ w: containerRef.current.offsetWidth, h: containerRef.current.offsetHeight });
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  useEffect(() => {
    import('react-globe.gl').then((mod) => {
      setGlobeEl(() => mod.default);
      setGlobeLoaded(true);
    });
    // Load country borders GeoJSON for realistic globe
    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then((r) => r.json())
      .then((data) => setCountries(data.features || []))
      .catch(() => {}); // silently fail — borders are enhancement only
  }, []);

  useEffect(() => {
    if (!globeRef.current) return;
    const controls = globeRef.current.controls();
    if (controls) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.35;
      controls.enableZoom = true;
      controls.minDistance = 180;
      controls.maxDistance = 600;
    }
    globeRef.current.pointOfView({ lat: 52, lng: 14, altitude: 2.0 }, 1200);
  }, [globeLoaded, GlobeEl]);

  const flyTo = useCallback((lat: number, lng: number, stopRotate = true) => {
    if (!globeRef.current) return;
    globeRef.current.pointOfView({ lat, lng, altitude: 1.5 }, 800);
    if (stopRotate) {
      const controls = globeRef.current.controls();
      if (controls) controls.autoRotate = false;
    }
  }, []);

  const handleClusterClick = useCallback((point: object) => {
    const cl = point as Cluster;
    hapticFeedback('medium');
    flyTo(cl.lat, cl.lng);
    if (cl.churches.length === 1) {
      setSelectedChurch(cl.churches[0]);
      setSelectedCluster(null);
    } else {
      setSelectedCluster(cl);
      setSelectedChurch(null);
    }
  }, [flyTo]);

  const closeAll = () => {
    setSelectedCluster(null);
    setSelectedChurch(null);
    if (globeRef.current) {
      const controls = globeRef.current.controls();
      if (controls) { controls.autoRotate = true; controls.autoRotateSpeed = 0.35; }
    }
  };

  const selectFromSearch = (c: ChurchLocation) => {
    hapticFeedback('light');
    setSearch('');
    setSelectedChurch(c);
    setSelectedCluster(null);
    flyTo(c.lat, c.lng);
  };

  // Globe data
  const globePoints = clusters.map((cl) => ({
    ...cl,
    count: cl.churches.length,
    color: cl.churches.some((c) => c.id === 'emmanuil-amsterdam') ? '#C9A96E' : '#5E9ED6',
    radius: cl.churches.length > 1 ? 0.9 : 0.6,
  }));

  return (
    <div style={{
      position: 'fixed', inset: 0,
      bottom: 'var(--bottom-nav-height)',
      background: '#060c18',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>

      {/* ── Top bar (globe only) ─────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20,
        padding: view === 'feed' ? '14px 16px 8px' : '14px 16px 10px',
        background: view === 'feed' ? 'var(--bg)' : 'transparent',
        borderBottom: view === 'feed' ? '1px solid var(--border)' : 'none',
      }}>
        {/* Toggle row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: view === 'feed' ? 'flex-end' : 'space-between', marginBottom: view === 'globe' ? 10 : 0 }}>
          {view === 'globe' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Globe2 size={17} color="rgba(255,255,255,0.6)" />
              <span style={{ fontSize: 15, fontWeight: 700, color: '#fff', letterSpacing: -0.3 }}>
                Kairos
              </span>
              <span style={{
                fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 100,
                background: 'rgba(94,158,214,0.2)', color: '#89BBE5',
                border: '1px solid rgba(94,158,214,0.25)',
              }}>
                {churchLocations.length}
              </span>
            </div>
          )}

          {/* Toggle: Глобус | Лента */}
          <div style={{
            display: 'flex', borderRadius: 20, overflow: 'hidden',
            background: view === 'feed' ? 'var(--bg-secondary)' : 'rgba(255,255,255,0.12)',
            border: view === 'feed' ? '1px solid var(--border)' : '1px solid rgba(255,255,255,0.15)',
          }}>
            {(['globe', 'feed'] as const).map((v) => (
              <button
                key={v}
                onClick={() => { hapticFeedback('light'); setView(v); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  background: view === v
                    ? (view === 'feed' ? 'var(--primary)' : 'rgba(255,255,255,0.25)')
                    : 'transparent',
                  color: view === v ? '#fff' : (view === 'feed' ? 'var(--text-secondary)' : 'rgba(255,255,255,0.55)'),
                  transition: 'all 0.15s',
                }}
              >
                {v === 'globe' ? <><Globe2 size={12} /> Глобус</> : <><Rss size={12} /> Лента</>}
              </button>
            ))}
          </div>
        </div>

        {/* Search — only on globe view */}
        {view === 'globe' && (
          <>
            <div style={{ position: 'relative' }}>
              <Search size={14} color="rgba(255,255,255,0.35)"
                style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Пошук міста або церкви..."
                style={{
                  width: '100%', padding: '10px 36px 10px 34px',
                  background: 'rgba(255,255,255,0.09)',
                  border: '1px solid rgba(255,255,255,0.13)',
                  borderRadius: 12, color: '#fff', fontSize: 14,
                }}
              />
              {search && (
                <button onClick={() => setSearch('')}
                  style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', padding: 4 }}>
                  <X size={14} color="rgba(255,255,255,0.45)" />
                </button>
              )}
            </div>
            <AnimatePresence>
              {search && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                  style={{
                    marginTop: 6, background: 'rgba(10,18,35,0.97)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 12, overflow: 'hidden', maxHeight: 260, overflowY: 'auto',
                  }}
                >
                  {filtered.length === 0 ? (
                    <p style={{ padding: '14px 16px', fontSize: 13, color: 'rgba(255,255,255,0.35)', textAlign: 'center' }}>
                      Нічого не знайдено
                    </p>
                  ) : filtered.map((c: ChurchLocation) => (
                    <button key={c.id} onClick={() => selectFromSearch(c)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '11px 14px', width: '100%', textAlign: 'left',
                        borderBottom: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer',
                      }}>
                      <MapPin size={13} color="#5E9ED6" />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{c.name}</p>
                        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 1 }}>{c.city}, {c.country}</p>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

      </div>

      {/* ── Feed view ────────────────────────────────────────────── */}
      {view === 'feed' && (
        <div style={{ position: 'absolute', inset: 0, top: 52, bottom: 0, overflowY: 'auto', background: 'var(--bg)', zIndex: 10 }}>
          <WorldFeed />
        </div>
      )}

      {/* ── Globe ────────────────────────────────────────────────── */}
      <div ref={containerRef} style={{ flex: 1, width: '100%', opacity: view === 'globe' ? 1 : 0, pointerEvents: view === 'globe' ? 'auto' : 'none' }}>
        {globeLoaded && GlobeEl && dimensions.w > 0 ? (
          <GlobeEl
            ref={globeRef}
            width={dimensions.w}
            height={dimensions.h}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
            bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
            backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
            atmosphereColor="#4a9fd4"
            atmosphereAltitude={0.15}
            // Cluster points
            pointsData={globePoints}
            pointLat="lat"
            pointLng="lng"
            pointColor="color"
            pointAltitude={0.015}
            pointRadius="radius"
            pointResolution={12}
            pointLabel={(d: any) => `
              <div style="
                background:rgba(8,16,32,0.92);
                border:1px solid rgba(94,158,214,0.4);
                border-radius:10px; padding:8px 12px;
                font-family:Inter,sans-serif; pointer-events:none;
              ">
                <div style="font-size:13px;font-weight:700;color:#fff">
                  ${d.churches.length > 1 ? `${d.city} (${d.churches.length})` : d.churches[0].name}
                </div>
                <div style="font-size:11px;color:rgba(255,255,255,0.5);margin-top:2px">
                  ${d.country}
                </div>
              </div>
            `}
            onPointClick={handleClusterClick}
            // Country borders
            polygonsData={countries}
            polygonCapColor={() => 'rgba(255,255,255,0.03)'}
            polygonSideColor={() => 'transparent'}
            polygonStrokeColor={() => 'rgba(180,210,255,0.22)'}
            polygonAltitude={0.002}
            // Subtle pulse rings
            ringsData={globePoints}
            ringLat="lat"
            ringLng="lng"
            ringColor={() => () => 'rgba(94,158,214,0.25)'}
            ringMaxRadius={0.8}
            ringPropagationSpeed={1.2}
            ringRepeatPeriod={2000}
          />
        ) : (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              border: '3px solid rgba(94,158,214,0.15)',
              borderTop: '3px solid #5E9ED6',
              animation: 'spin 1s linear infinite',
            }} />
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>Завантаження глобусу...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}
      </div>

      {/* ── Cluster list (multiple churches in one city) ──────────── */}
      <AnimatePresence>
        {selectedCluster && !selectedChurch && (
          <motion.div
            initial={{ y: 300, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 300, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              background: 'rgba(8,16,32,0.97)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '20px 20px 0 0',
              padding: '0 0 20px', zIndex: 30,
              maxHeight: '60%', display: 'flex', flexDirection: 'column',
            }}
          >
            <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.18)', margin: '14px auto 12px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px 12px' }}>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#fff' }}>
                  {selectedCluster.city}
                </h3>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>
                  {selectedCluster.churches.length} церкви
                </p>
              </div>
              <button onClick={closeAll} style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={15} color="rgba(255,255,255,0.55)" />
              </button>
            </div>
            <div style={{ overflowY: 'auto', padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {selectedCluster.churches.map((c) => (
                <button
                  key={c.id}
                  onClick={() => { hapticFeedback('light'); setSelectedChurch(c); setSelectedCluster(null); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 14px', borderRadius: 14,
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    textAlign: 'left', cursor: 'pointer',
                  }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(94,158,214,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MapPin size={16} color="#5E9ED6" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{c.name}</p>
                    {c.schedule && <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{c.schedule}</p>}
                  </div>
                  <ChevronRight size={15} color="rgba(255,255,255,0.3)" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Single church card ────────────────────────────────────── */}
      <AnimatePresence>
        {selectedChurch && (
          <motion.div
            initial={{ y: 200, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 200, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              background: 'rgba(8,16,32,0.97)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '20px 20px 0 0',
              padding: '20px 20px 28px', zIndex: 30,
            }}
          >
            <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.18)', margin: '0 auto 16px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{selectedChurch.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <MapPin size={12} color="#5E9ED6" />
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{selectedChurch.city}, {selectedChurch.country}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {selectedCluster === null && (
                  <button
                    onClick={() => { setSelectedChurch(null); const cl = clusters.find(c => c.churches.some(ch => ch.id === selectedChurch.id)); if (cl && cl.churches.length > 1) setSelectedCluster(cl); }}
                    style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <ChevronRight size={15} color="rgba(255,255,255,0.4)" style={{ transform: 'rotate(180deg)' }} />
                  </button>
                )}
                <button onClick={closeAll} style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <X size={15} color="rgba(255,255,255,0.55)" />
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <MapPin size={13} color="rgba(255,255,255,0.25)" />
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>{selectedChurch.address}</span>
              </div>
              {selectedChurch.schedule && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Clock size={13} color="rgba(255,255,255,0.25)" />
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>{selectedChurch.schedule}</span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => openLink(`https://maps.google.com/?q=${selectedChurch.lat},${selectedChurch.lng}`)}
                style={{
                  flex: 1, padding: '11px 8px', borderRadius: 12,
                  background: 'rgba(94,158,214,0.12)', border: '1px solid rgba(94,158,214,0.25)',
                  color: '#5E9ED6', fontSize: 13, fontWeight: 600,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, cursor: 'pointer',
                }}>
                <MapPin size={13} /> Навігатор
              </button>
              <button
                onClick={() => { hapticFeedback('medium'); navigate(`/church/${selectedChurch.id}`); }}
                style={{
                  flex: 1, padding: '11px 8px', borderRadius: 12,
                  background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
                  color: '#fff', fontSize: 13, fontWeight: 600,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, cursor: 'pointer',
                }}>
                <User size={13} /> Профіль
              </button>
              {selectedChurch.telegram && (
                <button
                  onClick={() => openLink(selectedChurch.telegram!)}
                  style={{
                    flex: 1, padding: '11px 8px', borderRadius: 12,
                    background: 'linear-gradient(135deg, #1a3a5c, #2d5a8e)',
                    color: '#fff', fontSize: 13, fontWeight: 600,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, cursor: 'pointer',
                  }}>
                  <ExternalLink size={13} /> Mini App
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
