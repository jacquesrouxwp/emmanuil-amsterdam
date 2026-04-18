import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, MapPin, Clock, ExternalLink, Globe2 } from 'lucide-react';
import { hapticFeedback, openLink } from '@/lib/telegram';
import { useT } from '@/i18n/translations';
import { churchLocations, type ChurchLocation } from '@/data/churches';

// Lazy-load the heavy globe library
let GlobeComponent: any = null;

interface GlobePoint {
  lat: number;
  lng: number;
  church: ChurchLocation;
}

export function WorldPage() {
  const t = useT();
  const globeRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [globeLoaded, setGlobeLoaded] = useState(false);
  const [GlobeEl, setGlobeEl] = useState<any>(null);
  const [selected, setSelected] = useState<ChurchLocation | null>(null);
  const [search, setSearch] = useState('');
  const [dimensions, setDimensions] = useState({ w: 0, h: 0 });

  // Filter churches by search
  const filtered = churchLocations.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.country.toLowerCase().includes(q)
    );
  });

  const points: GlobePoint[] = churchLocations.map((c) => ({
    lat: c.lat,
    lng: c.lng,
    church: c,
  }));

  // Measure container
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setDimensions({
          w: containerRef.current.offsetWidth,
          h: containerRef.current.offsetHeight,
        });
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Lazy load globe
  useEffect(() => {
    import('react-globe.gl').then((mod) => {
      GlobeComponent = mod.default;
      setGlobeEl(() => GlobeComponent);
      setGlobeLoaded(true);
    });
  }, []);

  // Auto-rotate + initial camera
  useEffect(() => {
    if (!globeRef.current) return;
    const controls = globeRef.current.controls();
    if (controls) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.4;
      controls.enableZoom = true;
      controls.minDistance = 180;
      controls.maxDistance = 500;
    }
    // Point camera at Europe
    globeRef.current.pointOfView({ lat: 52, lng: 10, altitude: 2.2 }, 1000);
  }, [globeLoaded, GlobeEl]);

  const handlePointClick = useCallback((point: object) => {
    const p = point as GlobePoint;
    hapticFeedback('medium');
    setSelected(p.church);
    // Fly to clicked church
    if (globeRef.current) {
      globeRef.current.pointOfView(
        { lat: p.lat, lng: p.lng, altitude: 1.4 },
        800,
      );
      const controls = globeRef.current.controls();
      if (controls) controls.autoRotate = false;
    }
  }, []);

  const closeCard = () => {
    setSelected(null);
    if (globeRef.current) {
      const controls = globeRef.current.controls();
      if (controls) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.4;
      }
    }
  };

  const flyTo = (c: ChurchLocation) => {
    hapticFeedback('light');
    setSelected(c);
    setSearch('');
    if (globeRef.current) {
      globeRef.current.pointOfView({ lat: c.lat, lng: c.lng, altitude: 1.4 }, 900);
      const controls = globeRef.current.controls();
      if (controls) controls.autoRotate = false;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        bottom: 'var(--bottom-nav-height)',
        background: '#070d1a',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* ── Top bar ────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        zIndex: 20, padding: '14px 16px 10px',
      }}>
        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <Globe2 size={18} color="rgba(255,255,255,0.7)" />
          <span style={{ fontSize: 15, fontWeight: 700, color: '#fff', letterSpacing: -0.3 }}>
            Церкви світу
          </span>
          <span style={{
            fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 100,
            background: 'rgba(94,158,214,0.2)', color: '#89BBE5',
            border: '1px solid rgba(94,158,214,0.3)',
          }}>
            {churchLocations.length}
          </span>
        </div>

        {/* Search */}
        <div style={{ position: 'relative' }}>
          <Search
            size={15}
            color="rgba(255,255,255,0.4)"
            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Пошук церкви або міста..."
            style={{
              width: '100%', padding: '10px 36px 10px 36px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 12, color: '#fff',
              fontSize: 14, backdropFilter: 'blur(12px)',
            }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', padding: 4 }}
            >
              <X size={14} color="rgba(255,255,255,0.5)" />
            </button>
          )}
        </div>

        {/* Search results dropdown */}
        <AnimatePresence>
          {search && filtered.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              style={{
                marginTop: 6, background: 'rgba(15,25,45,0.96)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 12, overflow: 'hidden',
                backdropFilter: 'blur(16px)',
              }}
            >
              {filtered.map((c) => (
                <button
                  key={c.id}
                  onClick={() => flyTo(c)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '12px 14px', width: '100%', textAlign: 'left',
                    borderBottom: '1px solid rgba(255,255,255,0.07)',
                    cursor: 'pointer',
                  }}
                >
                  <MapPin size={14} color="#5E9ED6" />
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{c.name}</p>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{c.city}, {c.country}</p>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Globe ──────────────────────────────────────────────────── */}
      <div ref={containerRef} style={{ flex: 1, width: '100%' }}>
        {globeLoaded && GlobeEl && dimensions.w > 0 ? (
          <GlobeEl
            ref={globeRef}
            width={dimensions.w}
            height={dimensions.h}
            // Earth texture
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
            bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
            backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
            // Atmosphere glow
            atmosphereColor="#3a8fcc"
            atmosphereAltitude={0.18}
            // Church points
            pointsData={points}
            pointLat={(d: GlobePoint) => d.lat}
            pointLng={(d: GlobePoint) => d.lng}
            pointColor={() => '#5E9ED6'}
            pointAltitude={0.015}
            pointRadius={0.6}
            pointResolution={12}
            pointLabel={(d: GlobePoint) => `
              <div style="
                background: rgba(10,20,40,0.92);
                border: 1px solid rgba(94,158,214,0.5);
                border-radius: 10px;
                padding: 8px 12px;
                font-family: Inter, sans-serif;
                backdrop-filter: blur(8px);
              ">
                <div style="font-size:13px;font-weight:700;color:#fff">${d.church.name}</div>
                <div style="font-size:11px;color:rgba(255,255,255,0.55);margin-top:2px">${d.church.city}, ${d.church.country}</div>
              </div>
            `}
            onPointClick={handlePointClick}
            // Rings animation on points
            ringsData={points}
            ringLat={(d: GlobePoint) => d.lat}
            ringLng={(d: GlobePoint) => d.lng}
            ringColor={() => () => 'rgba(94,158,214,0.5)'}
            ringMaxRadius={3}
            ringPropagationSpeed={2}
            ringRepeatPeriod={1200}
          />
        ) : (
          // Loading state
          <div style={{
            height: '100%', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 16,
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              border: '3px solid rgba(94,158,214,0.2)',
              borderTop: '3px solid #5E9ED6',
              animation: 'spin 1s linear infinite',
            }} />
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Завантаження глобусу...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}
      </div>

      {/* ── Church info card (bottom sheet) ───────────────────────── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 200, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              background: 'rgba(12,22,40,0.97)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '20px 20px 0 0',
              padding: '20px 20px 24px',
              backdropFilter: 'blur(20px)',
              zIndex: 30,
            }}
          >
            {/* Drag handle */}
            <div style={{
              width: 36, height: 4, borderRadius: 2,
              background: 'rgba(255,255,255,0.2)',
              margin: '0 auto 16px',
            }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
                  {selected.name}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <MapPin size={13} color="#5E9ED6" />
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>
                    {selected.city}, {selected.country}
                  </span>
                </div>
              </div>
              <button
                onClick={closeCard}
                style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={16} color="rgba(255,255,255,0.6)" />
              </button>
            </div>

            {/* Info rows */}
            <div style={{ margin: '16px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <MapPin size={14} color="rgba(255,255,255,0.3)" />
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{selected.address}</span>
              </div>
              {selected.schedule && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Clock size={14} color="rgba(255,255,255,0.3)" />
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{selected.schedule}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => openLink(`https://maps.google.com/?q=${selected.lat},${selected.lng}`)}
                style={{
                  flex: 1, padding: '12px', borderRadius: 12,
                  background: 'rgba(94,158,214,0.15)',
                  border: '1px solid rgba(94,158,214,0.3)',
                  color: '#5E9ED6', fontSize: 14, fontWeight: 600,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  cursor: 'pointer',
                }}
              >
                <MapPin size={15} />
                Навігатор
              </button>
              {selected.telegram && (
                <button
                  onClick={() => openLink(selected.telegram!)}
                  style={{
                    flex: 1, padding: '12px', borderRadius: 12,
                    background: 'linear-gradient(135deg, #1a3a5c, #2d5a8e)',
                    color: '#fff', fontSize: 14, fontWeight: 600,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    cursor: 'pointer',
                  }}
                >
                  <ExternalLink size={15} />
                  Відкрити
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
