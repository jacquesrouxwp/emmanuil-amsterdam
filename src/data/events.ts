export interface ChurchEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  address: string;
  shortDesc: string;
  fullDesc: string;
  badge: string;
  color: string;
  brandName?: string;
  brandGradient?: string;
}

export const upcomingEvents: ChurchEvent[] = [
  {
    id: 'ev-1',
    title: 'Хрещення',
    date: '19 квітня 2026',
    time: '17:00',
    address: 'Javastraat 118, Amsterdam',
    badge: 'Свято',
    color: '#5E9ED6',
    brandName: 'EMMANUIL\nCHURCH',
    brandGradient: 'linear-gradient(135deg, #1a3a5c 0%, #2d5a8e 50%, #5E9ED6 100%)',
    shortDesc: 'Свято хрещення — люди каються і приходять до Христа.',
    fullDesc:
      'Хрещення — це завжди свято для церкви! Люди свідомо каються, приймають Ісуса Христа як свого Господа та Спасителя і заявляють про це через водне хрещення. Приходьте підтримати та порадіти разом!',
  },
  {
    id: 'ev-2',
    title: 'Молодіжний табір',
    date: '4–8 серпня 2026',
    address: 'Stadskanaal, Netherlands',
    badge: 'Табір',
    color: '#FF7F50',
    brandName: "ОБ'ЄДНАНІ\nПРОБУДЖЕННЯМ",
    brandGradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    shortDesc: 'Табір для української молоді з Європи — «Об\'єднані пробудженням».',
    fullDesc:
      '«Об\'єднані пробудженням» — табір для української молоді з Європи та Америки, організований церквами з Бельгії, Нідерландів та США. Сьогодні в Європі діє близько 126 українських церков у 20 країнах. Наша мета — зібрати молодих людей для духовного пробудження, глибокого спілкування та оновлення покликання слідувати за Христом.',
  },
];
