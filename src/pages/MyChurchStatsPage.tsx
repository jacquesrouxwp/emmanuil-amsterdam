import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Save, CheckCircle2, Loader2 } from 'lucide-react';
import { fetchStats, updateStats } from '@/lib/api';
import { hapticFeedback } from '@/lib/telegram';

interface StatsData {
  attendees: number;
  youth: number;
  children: number;
  homeGroups: number;
  ministries: number;
}

const FIELDS: { key: keyof StatsData; label: string; emoji: string }[] = [
  { key: 'attendees',  label: 'Відвідувачів щонеділі', emoji: '🙏' },
  { key: 'youth',      label: 'Молодь (18–35)',         emoji: '⚡' },
  { key: 'children',   label: 'Дитяча церква',          emoji: '🌱' },
  { key: 'homeGroups', label: 'Домашніх груп',          emoji: '🏠' },
  { key: 'ministries', label: 'Служінь',                emoji: '✝️' },
];

export function MyChurchStatsPage() {
  const navigate = useNavigate();
  const secret = localStorage.getItem('emmanuil_admin_secret') || '';

  const [stats, setStats] = useState<StatsData>({
    attendees: 0, youth: 0, children: 0, homeGroups: 0, ministries: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchStats().then((data) => {
      setStats({
        attendees:  Number(data.attendees  ?? 0),
        youth:      Number(data.youth      ?? 0),
        children:   Number(data.children   ?? 0),
        homeGroups: Number(data.homeGroups ?? 0),
        ministries: Number(data.ministries ?? 0),
      });
    }).finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    hapticFeedback('medium');
    try {
      await updateStats(secret, stats as unknown as Record<string, number>);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      alert('Помилка збереження: ' + (e?.message || ''));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ minHeight: '100%', overflowY: 'auto', background: 'var(--bg)', paddingBottom: 90 }}>

      {/* Header */}
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
        <p style={{ fontSize: 15, fontWeight: 700 }}>Статистика</p>
        <button onClick={handleSave} disabled={loading || saving}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 700,
            background: saved ? 'rgba(52,199,89,0.15)' : 'var(--primary)',
            color: saved ? '#34C759' : '#fff',
            cursor: (loading || saving) ? 'default' : 'pointer',
            transition: 'all 0.2s',
          }}>
          {saving
            ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><Loader2 size={14} /></motion.div>
            : saved ? <><CheckCircle2 size={14} /> Збережено</> : <><Save size={14} /> Зберегти</>}
        </button>
      </div>

      {/* Grid */}
      <div style={{ padding: '24px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {FIELDS.map(({ key, label, emoji }, i) => {
          const isLast = i === FIELDS.length - 1;
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{
                gridColumn: isLast ? '1 / -1' : undefined,
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: '20px 16px', borderRadius: 18,
                background: 'var(--bg-secondary)', border: '1px solid var(--border-light)',
                gap: 8,
              }}
            >
              <span style={{ fontSize: 24 }}>{emoji}</span>
              <input
                type="number"
                value={stats[key] || ''}
                onChange={(e) => setStats((s) => ({ ...s, [key]: Number(e.target.value) || 0 }))}
                disabled={loading}
                min={0}
                style={{
                  width: '100%', maxWidth: 120,
                  fontSize: 32, fontWeight: 800, textAlign: 'center',
                  background: 'transparent', border: 'none', outline: 'none',
                  color: 'var(--text-primary)',
                  borderBottom: '2px solid var(--border-light)',
                  paddingBottom: 4,
                }}
              />
              <p style={{ fontSize: 12, color: 'var(--text-tertiary)', textAlign: 'center', lineHeight: 1.4 }}>
                {label}
              </p>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
}
