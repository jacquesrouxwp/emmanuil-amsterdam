import { motion } from 'framer-motion';

interface EmptyStateProps {
  emoji: string;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  accentColor?: string;
}

export function EmptyState({
  emoji,
  title,
  subtitle,
  actionLabel,
  onAction,
  accentColor = 'var(--primary)',
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        minHeight: '40vh', textAlign: 'center',
        padding: '24px', gap: '16px',
      }}
    >
      <div style={{
        width: 72, height: 72, borderRadius: '50%',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-light)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 32,
      }}>
        {emoji}
      </div>

      <div style={{ maxWidth: 280 }}>
        <p style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
          {title}
        </p>
        {subtitle && (
          <p style={{ fontSize: 13, color: 'var(--text-tertiary)', lineHeight: 1.55 }}>
            {subtitle}
          </p>
        )}
      </div>

      {actionLabel && onAction && (
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onAction}
          style={{
            padding: '12px 24px', borderRadius: 12,
            background: accentColor, color: '#fff',
            fontSize: 14, fontWeight: 700, cursor: 'pointer',
            border: 'none',
          }}
        >
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  );
}
