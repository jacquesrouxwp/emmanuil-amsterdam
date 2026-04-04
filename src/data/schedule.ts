import type { Localized } from '@/i18n/translations';

export interface ServiceItem {
  id: string;
  title: Localized;
  day: Localized;
  time: string;
  address: string;
  type: 'service' | 'youth' | 'group';
  leader?: string;
  phone?: string;
  city?: string;
  brandName?: string;
  brandGradient?: string;
}

export const services: ServiceItem[] = [
  {
    id: 'srv-1',
    title: { ua: 'Воскресне служіння', ru: 'Воскресное служение', en: 'Sunday Service' },
    day: { ua: 'Неділя', ru: 'Воскресенье', en: 'Sunday' },
    time: '17:00',
    address: 'Javastraat 118, Amsterdam',
    type: 'service',
    brandName: 'EMMANUIL\nCHURCH',
    brandGradient: 'linear-gradient(135deg, #1a3a5c 0%, #2d5a8e 50%, #5E9ED6 100%)',
  },
  {
    id: 'srv-2',
    title: { ua: 'Молодіжне служіння', ru: 'Молодёжное служение', en: 'Youth Service' },
    day: { ua: 'Субота', ru: 'Суббота', en: 'Saturday' },
    time: '18:30',
    address: 'Javastraat 118, Amsterdam',
    type: 'youth',
    brandName: 'EMMANUIL\nYOUTH',
    brandGradient: 'linear-gradient(135deg, #2d1b4e 0%, #4a2d7a 50%, #7c4dff 100%)',
  },
];

export const homeGroups: ServiceItem[] = [
  {
    id: 'hg-1',
    title: { ua: 'Домашня група', ru: 'Домашняя группа', en: 'Home Group' },
    day: { ua: 'Середа', ru: 'Среда', en: 'Wednesday' },
    time: '19:00',
    address: 'Piet Mondriaanstraat 75, Amsterdam',
    type: 'group',
    leader: 'Pavlo',
    city: 'Amsterdam',
  },
  {
    id: 'hg-2',
    title: { ua: 'Домашня група', ru: 'Домашняя группа', en: 'Home Group' },
    day: { ua: 'Середа', ru: 'Среда', en: 'Wednesday' },
    time: '19:00',
    address: 'Leerbroekse Kerkweg 5, Leerbroek',
    type: 'group',
    leader: 'Vitali',
    city: 'Leerbroek',
  },
  {
    id: 'hg-3',
    title: { ua: 'Домашня група', ru: 'Домашняя группа', en: 'Home Group' },
    day: { ua: 'Четвер', ru: 'Четверг', en: 'Thursday' },
    time: '19:00',
    address: 'Mandelaplein 1, Almere',
    type: 'group',
    city: 'Almere',
  },
  {
    id: 'hg-4',
    title: { ua: 'Домашня група', ru: 'Домашняя группа', en: 'Home Group' },
    day: { ua: 'Четвер', ru: 'Четверг', en: 'Thursday' },
    time: '18:00',
    address: 'Wolfheze 4:96 (біля Арнема та Еде)',
    type: 'group',
    leader: 'Микола',
    phone: '+31 6 85 49 42 19',
    city: 'Wolfheze',
  },
  {
    id: 'hg-5',
    title: { ua: 'Домашня група', ru: 'Домашняя группа', en: 'Home Group' },
    day: { ua: 'Уточнюється', ru: 'Уточняется', en: 'TBD' },
    time: '—',
    address: 'Роттердам',
    type: 'group',
    leader: 'Oleksandr',
    phone: '+380 68 648 16 80',
    city: 'Rotterdam',
  },
];

export const typeColors: Record<string, string> = {
  service: '#5E9ED6',
  youth: '#FF7F50',
  group: '#9B7FD4',
};
