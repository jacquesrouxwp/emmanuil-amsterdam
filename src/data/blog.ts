import type { Localized } from '@/i18n/translations';

export interface BlogPost {
  id: string;
  date: string;
  title: Localized;
  body: Localized;
}

export const blogPosts: BlogPost[] = [
  {
    id: 'blog-picnic-2025',
    date: '2025-06-15',
    title: {
      ua: 'Церковний пікнік 🌿',
      ru: 'Церковный пикник 🌿',
      en: 'Church Picnic 🌿',
    },
    body: {
      ua: 'Провели чудовий час разом на природі — їжа, ігри, молитва та сміх. Дякуємо всім, хто прийшов!',
      ru: 'Провели замечательное время на природе — еда, игры, молитва и смех. Спасибо всем, кто пришёл!',
      en: 'We had a wonderful time together outdoors — food, games, prayer and laughter. Thank you to everyone who came!',
    },
  },
  {
    id: 'blog-disability-2025',
    date: '2025-04-05',
    title: {
      ua: 'Служіння людям з інвалідністю ♡',
      ru: 'Служение людям с инвалидностью ♡',
      en: 'Ministry for People with Disabilities ♡',
    },
    body: {
      ua: 'Знову відвідали наших друзів — разом співали, молилися та пили чай. Їхні усмішки — наша нагорода.',
      ru: 'Снова навестили наших друзей — вместе пели, молились и пили чай. Их улыбки — наша награда.',
      en: 'We visited our friends again — singing, praying and drinking tea together. Their smiles are our reward.',
    },
  },
];
