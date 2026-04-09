import type { Localized } from '@/i18n/translations';

export interface BlogPost {
  id: string;
  date: string;
  photos?: string[];
  title: Localized;
  body: Localized;
}

export const blogPosts: BlogPost[] = [
  {
    id: 'blog-picnic-2026-07-06',
    date: '2026-07-06',
    photos: [
      'https://i.ibb.co/WvMWFRLG/image.jpg',
      'https://i.ibb.co/fzD7jng1/2.jpg',
      'https://i.ibb.co/pr2pjKbc/3.jpg',
      'https://i.ibb.co/prkYRZFH/1.jpg',
    ],
    title: {
      ua: 'Церковний пікнік 🌿',
      ru: 'Церковный пикник 🌿',
      en: 'Church Picnic 🌿',
    },
    body: {
      ua: 'Зібралися церквою у прекрасний сонячний благословенний день! Смажили мʼясо, грали у волейбол, прославляли Бога! Поки весна і літо дозволяють — будемо влаштовувати такі вилазки частіше!',
      ru: 'Собрались церковью в прекрасный солнечный благословенный день! Жарили мясо, играли в волейбол, прославляли Бога! Пока весна и лето позволяют — будем устраивать такие вылазки чаще!',
      en: 'We gathered as a church on a beautiful sunny blessed day! Grilled meat, played volleyball, praised God! While spring and summer allow it — we will make such outings more often!',
    },
  },
  {
    id: 'blog-huizen-2026-04-07',
    date: '2026-04-07',
    photos: ['https://i.ibb.co/Q37WJhFH/2.jpg'],
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
