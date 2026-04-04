import type { Localized } from '@/i18n/translations';

export interface ChurchEvent {
  id: string;
  title: Localized;
  date: Localized;
  time?: string;
  address: string;
  shortDesc: Localized;
  fullDesc: Localized;
  badge: Localized;
  color: string;
  brandName?: string;
  brandGradient?: string;
}

export const upcomingEvents: ChurchEvent[] = [
  {
    id: 'ev-1',
    title: { ua: 'Хрещення', ru: 'Крещение', en: 'Baptism' },
    date: { ua: '19 квітня 2026', ru: '19 апреля 2026', en: 'April 19, 2026' },
    time: '17:00',
    address: 'Javastraat 118, Amsterdam',
    badge: { ua: 'Свято', ru: 'Праздник', en: 'Celebration' },
    color: '#5E9ED6',
    brandName: 'EMMANUIL\nCHURCH',
    brandGradient: 'linear-gradient(135deg, #1a3a5c 0%, #2d5a8e 50%, #5E9ED6 100%)',
    shortDesc: {
      ua: 'Свято хрещення — люди каються і приходять до Христа.',
      ru: 'Праздник крещения — люди каются и приходят ко Христу.',
      en: 'Baptism celebration — people repent and come to Christ.',
    },
    fullDesc: {
      ua: 'Хрещення — це завжди свято для церкви! Люди свідомо каються, приймають Ісуса Христа як свого Господа та Спасителя і заявляють про це через водне хрещення. Приходьте підтримати та порадіти разом!',
      ru: 'Крещение — это всегда праздник для церкви! Люди осознанно каются, принимают Иисуса Христа как своего Господа и Спасителя и заявляют об этом через водное крещение. Приходите поддержать и порадоваться вместе!',
      en: 'Baptism is always a celebration for the church! People consciously repent, accept Jesus Christ as their Lord and Saviour and declare it through water baptism. Come to support and rejoice together!',
    },
  },
  {
    id: 'ev-2',
    title: { ua: 'Молодіжний табір', ru: 'Молодёжный лагерь', en: 'Youth Camp' },
    date: { ua: '4–8 серпня 2026', ru: '4–8 августа 2026', en: 'August 4–8, 2026' },
    address: 'Stadskanaal, Netherlands',
    badge: { ua: 'Табір', ru: 'Лагерь', en: 'Camp' },
    color: '#FF7F50',
    brandName: "ОБ'ЄДНАНІ\nПРОБУДЖЕННЯМ",
    brandGradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    shortDesc: {
      ua: "Табір для української молоді з Європи — «Об'єднані пробудженням».",
      ru: "Лагерь для украинской молодёжи из Европы — «Объединённые пробуждением».",
      en: "Camp for Ukrainian youth from Europe — \"United by Revival\".",
    },
    fullDesc: {
      ua: "«Об'єднані пробудженням» — табір для української молоді з Європи та Америки, організований церквами з Бельгії, Нідерландів та США. Сьогодні в Європі діє близько 126 українських церков у 20 країнах. Наша мета — зібрати молодих людей для духовного пробудження, глибокого спілкування та оновлення покликання слідувати за Христом.",
      ru: "«Объединённые пробуждением» — лагерь для украинской молодёжи из Европы и Америки, организованный церквями из Бельгии, Нидерландов и США. Сегодня в Европе действует около 126 украинских церквей в 20 странах. Наша цель — собрать молодых людей для духовного пробуждения, глубокого общения и обновления призвания следовать за Христом.",
      en: "\"United by Revival\" — a camp for Ukrainian youth from Europe and America, organised by churches from Belgium, the Netherlands and the USA. Today about 126 Ukrainian churches are active in 20 European countries. Our goal is to bring young people together for spiritual revival, deep fellowship and renewal of the calling to follow Christ.",
    },
  },
];
