export interface ChurchLocation {
  id: string;
  name: string;
  city: string;
  country: string;
  address: string;
  lat: number;
  lng: number;
  schedule?: string;
  phone?: string;
  telegram?: string;
  language: string[];
  photo?: string;
}

export const churchLocations: ChurchLocation[] = [
  {
    id: 'emmanuil-amsterdam',
    name: 'Emmanuil Amsterdam',
    city: 'Amsterdam',
    country: 'Netherlands',
    address: 'Javastraat 118, Amsterdam',
    lat: 52.3657,
    lng: 4.9295,
    schedule: 'Неділя 17:00',
    telegram: 'https://t.me/myconclaw_bot/app',
    language: ['ua', 'ru', 'en', 'nl'],
    photo: 'https://i.ibb.co/HfHyBkxm/amster.jpg',
  },
];
