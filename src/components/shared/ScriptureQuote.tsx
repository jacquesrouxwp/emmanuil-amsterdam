import { motion } from 'framer-motion';
import { getTodayScripture } from '@/data/scripture';

export function ScriptureQuote() {
  const quote = getTodayScripture();

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
