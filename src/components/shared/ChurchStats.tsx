import { motion } from 'framer-motion';
import { Users, Flame, Baby, Home, HandHeart } from 'lucide-react';
import { useT } from '@/i18n/translations';

type StatItem = {
  key: 'attendees' | 'youth' | 'children' | 'homeGroups' | 'ministries';
  icon: typeof Users;
  value: number;
  span: number;
};

const STATS: StatItem[] = [
  { key: 'attendees', icon: Users, value: 402, span: 2 },
  { key: 'youth', icon: Flame, value: 43, span: 2 },
  { key: 'children', icon: Baby, value: 32, span: 2 },
  { key: 'homeGroups', icon: Home, value: 7, span: 3 },
  { key: 'ministries', icon: HandHeart, value: 4, span: 3 },
];

export function ChurchStats() {
  const t = useT();
  const labels = t.home.stats;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: 8,
      }}
    >
      {STATS.map(({ key, icon: Icon, value, span }) => (
        <div
          key={key}
          style={{
            gridColumn: `span ${span}`,
            background: 'var(--bg-card)',
            border: '1px solid var(--border-light)',
            borderRadius: 12,
            padding: '10px 8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
            minHeight: 74,
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
          }}
        >
          <Icon size={18} color="var(--primary)" strokeWidth={2} />
          <div
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: 'var(--text-primary)',
              fontVariantNumeric: 'tabular-nums',
              lineHeight: 1,
            }}
          >
            {value}
          </div>
          <div
            style={{
              fontSize: 10,
              color: 'var(--text-tertiary)',
              textAlign: 'center',
              lineHeight: 1.15,
              letterSpacing: 0.2,
            }}
          >
            {labels[key]}
          </div>
        </div>
      ))}
    </motion.div>
  );
}
