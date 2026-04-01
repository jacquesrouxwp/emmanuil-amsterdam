export interface ServiceItem {
  id: string;
  title: string;
  day: string;
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
    title: 'Воскресне служіння',
    day: 'Неділя',
    time: '17:00',
    address: 'Javastraat 118, Amsterdam',
    type: 'service',
    brandName: 'EMMANUIL\nCHURCH',
    brandGradient: 'linear-gradient(135deg, #1a3a5c 0%, #2d5a8e 50%, #5E9ED6 100%)',
  },
  {
    id: 'srv-2',
    title: 'Молодіжне служіння',
    day: 'Субота',
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
    title: 'Домашня група',
    day: 'Середа',
    time: '19:00',
    address: 'Piet Mondriaanstraat 75, Amsterdam',
    type: 'group',
    leader: 'Pavlo',
    city: 'Amsterdam',
  },
  {
    id: 'hg-2',
    title: 'Домашня група',
    day: 'Середа',
    time: '19:00',
    address: 'Leerbroekse Kerkweg 5, Leerbroek',
    type: 'group',
    leader: 'Vitali',
    city: 'Leerbroek',
  },
  {
    id: 'hg-3',
    title: 'Домашня група',
    day: 'Четвер',
    time: '19:00',
    address: 'Mandelaplein 1, Almere',
    type: 'group',
    city: 'Almere',
  },
  {
    id: 'hg-4',
    title: 'Домашня група',
    day: 'Четвер',
    time: '18:00',
    address: 'Wolfheze 4:96 (біля Арнема та Еде)',
    type: 'group',
    leader: 'Микола',
    phone: '+31 6 85 49 42 19',
    city: 'Wolfheze',
  },
  {
    id: 'hg-5',
    title: 'Домашня група',
    day: 'Уточнюється',
    time: 'Уточнюється',
    address: 'Роттердам (адреса уточнюється)',
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
