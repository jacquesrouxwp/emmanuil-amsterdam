import { motion } from 'framer-motion';
import { MessageCircle, Phone } from 'lucide-react';
import { hapticFeedback, openTelegramLink } from '@/lib/telegram';
import type { Person } from '@/types';

interface PersonCardProps {
  person: Person;
  index?: number;
  showActions?: boolean;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function PersonCard({ person, index = 0, showActions = true }: PersonCardProps) {
  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
    >
      <div style={{ display: 'flex', gap: 14 }}>
        <div className="avatar avatar--lg">
          {person.photo ? (
            <img src={person.photo} alt={person.name} />
          ) : (
            getInitials(person.name)
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600 }}>{person.name}</h3>
          <p style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 500, marginBottom: 4 }}>
            {person.role}
          </p>
          {person.description && (
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {person.description}
            </p>
          )}
        </div>
      </div>

      {showActions && (person.telegram || person.phone) && (
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          {person.telegram && (
            <button
              className="btn btn--secondary btn--sm"
              style={{ flex: 1 }}
              onClick={() => {
                hapticFeedback('light');
                const tg = person.telegram!;
                // Support both @username and phone number formats
                const link = tg.startsWith('+') || /^\d/.test(tg)
                  ? `https://t.me/${tg.replace(/[\s+()-]/g, '')}`
                  : `https://t.me/${tg.replace('@', '')}`;
                openTelegramLink(link);
              }}
            >
              <MessageCircle size={16} />
              Написати
            </button>
          )}
          {person.phone && (
            <a
              href={`tel:${person.phone}`}
              className="btn btn--outline btn--sm"
              style={{ flex: 1, textDecoration: 'none' }}
              onClick={() => hapticFeedback('light')}
            >
              <Phone size={16} />
              Зателефонувати
            </a>
          )}
        </div>
      )}
    </motion.div>
  );
}
