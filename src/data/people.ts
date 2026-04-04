import type { Person } from '@/types';

export const pastors: Person[] = [
  {
    id: 'p-1',
    name: 'Сергій',
    role: { ua: 'Пастор', ru: 'Пастор', en: 'Pastor' },
    description: {
      ua: 'Пастор церкви Emmanuil Amsterdam. Служить Богу та людям у Нідерландах.',
      ru: 'Пастор церкви Emmanuil Amsterdam. Служит Богу и людям в Нидерландах.',
      en: 'Pastor of Emmanuil Amsterdam church. Serving God and people in the Netherlands.',
    },
    telegram: '+380679816279',
  },
];

export const leaders: Person[] = [];
