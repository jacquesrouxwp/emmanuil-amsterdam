import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getCurrentScripture, getSecondsUntilNextSlot } from '@/data/scripture';
import { useLang } from '@/i18n/translations';

interface Props {
  compact?: boolean;
}

function formatCountdown(secs: number): string {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function ScriptureQuote({ compact }: Props) {
  const lang = useLang();
  const [scripture, setScripture] = useState(() => getCurrentScripture());
  const [secs, setSecs] = useState(() => getSecondsUntilNextSlot());

  useEffect(() => {
    const tick = setInterval(() => {
      const remaining = getSecondsUntilNextSlot();
      setSecs(remaining);
      // Refresh scripture when slot flips
      if (remaining === 30 * 60 - 1) {
        setScripture(getCurrentScripture());
      }
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  const text = (scripture.text as Record<string, string>)[lang] ?? scripture.text.en;
  const reference = (scripture.reference as Record<string, string>)[lang] ?? scripture.reference.en;

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
          position: 'relative',
        }}
      >
        <p style={{ fontSize: 12, fontStyle: 'italic', color: 'var(--text-secondary)', lineHeight: 1.5, paddingRight: 48 }}>
          {text}
        </p>
        <p style={{ fontSize: 11, color: 'var(--accent-gold)', fontWeight: 600, marginTop: 4 }}>
          — {reference}
        </p>
        {/* Countdown timer */}
        <div style={{
          position: 'absolute', top: 8, right: 10,
          display: 'flex', alignItems: 'center', gap: 3,
          fontSize: 10, fontWeight: 700,
          color: 'var(--accent-gold)',
          opacity: 0.7,
          letterSpacing: 0.5,
          fontVariantNumeric: 'tabular-nums',
        }}>
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          {formatCountdown(secs)}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="scripture-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      style={{ position: 'relative' }}
    >
      <p className="scripture-text">{text}</p>
      <p className="scripture-ref">— {reference}</p>
      <div style={{
        position: 'absolute', top: 10, right: 12,
        fontSize: 10, fontWeight: 700,
        color: 'var(--accent-gold)', opacity: 0.7,
        letterSpacing: 0.5,
        fontVariantNumeric: 'tabular-nums',
      }}>
        {formatCountdown(secs)}
      </div>
    </motion.div>
  );
}
