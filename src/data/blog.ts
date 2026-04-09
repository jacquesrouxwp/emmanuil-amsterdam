import type { Localized } from '@/i18n/translations';

export interface BlogPost {
  id: string;
  date: string;
  photo?: string;
  title: Localized;
  body: Localized;
}

export const blogPosts: BlogPost[] = [
  {
    id: 'blog-huizen-2026-04-07',
    date: '2026-04-07',
    photo: 'https://i.ibb.co/Q37WJhFH/2.jpg',
    title: {
      ua: 'Церква Emmanuil на локації для людей з інвалідністю в місті Huizen',
      ru: 'Церковь Emmanuil на локации для людей с инвалидностью в городе Huizen',
      en: 'Emmanuil Church at the disability care location in Huizen',
    },
    body: {
      ua: 'Ми відвідали наших друзів на локації в місті Huizen — співали пісні, ділилися Словом, провели хлібопреломлення. Сестра Надія показала близько 30 картин ручної вишивки — неймовірний Богом даний талант! Плануємо майбутню виставку в церкві з її свідченням.',
      ru: 'Мы посетили наших друзей на локации в городе Huizen — пели песни, делились Словом, провели хлебопреломление. Сестра Надежда показала около 30 картин ручной вышивки — невероятный Богом данный талант! Планируем будущую выставку в церкви с её свидетельством.',
      en: 'We visited our friends at the care location in Huizen — sang songs, shared the Word, had communion. Sister Nadezhda showed about 30 hand-embroidery paintings — an incredible God-given talent! We are planning a future exhibition at the church with her testimony.',
    },
  },
];
