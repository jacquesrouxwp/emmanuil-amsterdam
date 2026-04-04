import { motion } from 'framer-motion';
import { getTodayScripture } from '@/data/scripture';

interface Props {
  compact?: boolean;
}

export function ScriptureQuote({ compact }: Props) {
  const quote = getTodayScripture();

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          background: 'var(--accent-gold-bg)',
          border: '1px solid rgba(201,169,110,0.15)',
          borderRadius: 12,
          padding: '10px 14px',
        }}
      >
        <p style={{ fontSize: 12, fontStyle: 'italic', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          {quote.text}
        </p>
        <p style={{ fontSize: 11, color: 'var(--accent-gold)', fontWeight: 600, marginTop: 4 }}>
          — {quote.reference}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="scripture-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <p className="scripture-text">{quote.text}</p>
      <p className="scripture-ref">— {quote.reference}</p>
    </motion.div>
  );
}
