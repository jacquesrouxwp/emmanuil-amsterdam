import type { HomeGroup } from '@/types';

export const homeGroups: HomeGroup[] = [
  {
    id: 'g-1',
    name: 'Сияние',
    leader: 'Анна Петрова',
    description:
      'Женская группа для изучения Библии и взаимной поддержки. Тёплая атмосфера, глубокое общение.',
    district: 'Centrum',
    address: 'Keizersgracht 120',
    day: 'Вторник',
    time: '19:00',
    membersCount: 12,
    maxMembers: 15,
  },
  {
    id: 'g-2',
    name: 'Скала',
    leader: 'Игорь Козлов',
    description:
      'Мужская группа. Честные разговоры о вере, ответственности и ученичестве. Поддержка и братство.',
    district: 'De Pijp',
    address: 'Ferdinand Bolstraat 85',
    day: 'Среда',
    time: '19:30',
    membersCount: 8,
    maxMembers: 12,
  },
  {
    id: 'g-3',
    name: 'Новое поколение',
    leader: 'Дмитрий Соколов',
    description:
      'Молодёжная группа 18-30 лет. Изучение Слова, дискуссии, совместные активности и служение.',
    district: 'Oost',
    address: 'Linnaeusstraat 45',
    day: 'Пятница',
    time: '19:00',
    membersCount: 18,
    maxMembers: 25,
  },
  {
    id: 'g-4',
    name: 'Семейный очаг',
    leader: 'Михаил и Елена Крыловы',
    description:
      'Группа для семейных пар. Совместное изучение Библии, обсуждение семейных тем, общение между семьями.',
    district: 'Zuid',
    address: 'Beethovenstraat 200',
    day: 'Четверг',
    time: '19:00',
    membersCount: 14,
    maxMembers: 20,
  },
  {
    id: 'g-5',
    name: 'Источник жизни',
    leader: 'Наталья Волкова',
    description:
      'Смешанная группа для всех возрастов. Изучение книг Библии по главам, молитва друг за друга.',
    district: 'West',
    address: 'Overtoom 310',
    day: 'Среда',
    time: '19:00',
    membersCount: 10,
    maxMembers: 15,
  },
  {
    id: 'g-6',
    name: 'Благодать',
    leader: 'Сергей Морозов',
    description:
      'Группа для новых верующих и тех, кто хочет укрепить основы веры. Дружелюбная и открытая атмосфера.',
    district: 'Noord',
    address: 'Buiksloterdijk 18',
    day: 'Вторник',
    time: '19:30',
    membersCount: 7,
    maxMembers: 12,
  },
];

export function getDistricts(): string[] {
  return [...new Set(homeGroups.map((g) => g.district))];
}
