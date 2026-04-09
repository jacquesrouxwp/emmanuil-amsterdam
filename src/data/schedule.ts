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
  description?: Localized;
  photo?: string;
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
    description: {
      ua: 'Доступна для тих, хто живе в Амстердамі — легко дістатися велосипедом, метро або трамваєм. Скористайтеся навігатором!',
      ru: 'Доступна для тех, кто живёт в Амстердаме — легко добраться на велосипеде, метро или трамвае. Воспользуйтесь навигатором!',
      en: 'Accessible for those living in Amsterdam — easy to reach by bike, metro, or tram. Use your navigation app!',
    },
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
    description: {
      ua: 'Знаходиться недалеко від Утрехта. Громадським транспортом дістатися складно — прямого поїзда чи автобуса немає. Найкраще автомобілем, тому знайдіть когось, хто їде по дорозі!',
      ru: 'Находится недалеко от Утрехта. Общественным транспортом добраться сложно — прямого поезда и автобуса нет. Лучше всего на машине, найдите попутчика!',
      en: 'Located near Utrecht. Public transport is difficult — no direct train or bus. Best by car, so find someone going your way!',
    },
  },
  {
    id: 'hg-3',
    title: { ua: 'Домашня група', ru: 'Домашняя группа', en: 'Home Group' },
    day: { ua: 'Четвер', ru: 'Четверг', en: 'Thursday' },
    time: '19:00',
    address: 'Best Western Plus (Plaza Premium), Almere — вхід через головний вхід готелю, ліфт на 15 поверх',
    type: 'group',
    city: 'Almere',
    description: {
      ua: 'Знаходиться в 1 хвилині від центрального залізничного вокзалу Альмере. Зайдіть через головний вхід готелю Best Western Plus (Plaza Premium) і піднімайтеся ліфтом на 15 поверх!',
      ru: 'Находится в 1 минуте от центрального вокзала Алмере. Войдите через главный вход отеля Best Western Plus (Plaza Premium) и поднимитесь на лифте на 15 этаж!',
      en: 'Located 1 minute from Almere Central train station. Enter through the main entrance of Best Western Plus (Plaza Premium) hotel and take the elevator to the 15th floor!',
    },
    photo: 'https://i.ibb.co/PvpJ9zTv/1123221.jpg',
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
