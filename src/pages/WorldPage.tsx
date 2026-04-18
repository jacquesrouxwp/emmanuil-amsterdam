import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, MapPin, Clock, ExternalLink, Globe2, ChevronRight, User } from 'lucide-react';
import { hapticFeedback, openLink } from '@/lib/telegram';
import { churchLocations, type ChurchLocation } from '@/data/churches';

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
  const globeRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [globeLoaded, setGlobeLoaded] = useState(false);
  const [GlobeEl, setGlobeEl] = useState<any>(null);
  const [selectedCluster, setSelectedCluster] = useState<Cluster | null>(null);
  const [selectedChurch, setSelectedChurch] = useState<ChurchLocation | null>(null);
  const [search, setSearch] = useState('');
  const [dimensions, setDimensions] = useState({ w: 0, h: 0 });

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

      {/* ── Top bar ──────────────────────────────────────────────── */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20, padding: '14px 16px 10px' }}>
        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <Globe2 size={17} color="rgba(255,255,255,0.6)" />
          <span style={{ fontSize: 15, fontWeight: 700, color: '#fff', letterSpacing: -0.3 }}>
            Церкви світу
          </span>
          <span style={{
            fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 100,
            background: 'rgba(94,158,214,0.2)', color: '#89BBE5',
            border: '1px solid rgba(94,158,214,0.25)',
          }}>
            {churchLocations.length}
          </span>
        </div>

        {/* Search */}
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

        {/* Search results */}
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
              ) : filtered.map((c) => (
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
      </div>

      {/* ── Globe ────────────────────────────────────────────────── */}
      <div ref={containerRef} style={{ flex: 1, width: '100%' }}>
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
