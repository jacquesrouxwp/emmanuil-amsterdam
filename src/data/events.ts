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
  brandName?: Localized;
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
    brandName: { ua: 'EMMANUIL\nCHURCH', ru: 'EMMANUIL\nCHURCH', en: 'EMMANUIL\nCHURCH' },
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
    id: 'ev-disability',
    title: { ua: 'Служіння для людей з інвалідністю', ru: 'Служение для людей с инвалидностью', en: 'Ministry for People with Disabilities' },
    date: { ua: 'Раз на місяць', ru: 'Раз в месяц', en: 'Once a month' },
    address: 'Amsterdam & Netherlands',
    badge: { ua: 'Місія', ru: 'Миссия', en: 'Mission' },
    color: '#AF52DE',
    brandName: {
      ua: '«І той, хто допоможе\nодному з малих цих…\nотримає свою нагороду»',
      ru: '«И тот, кто поможет\nодному из малых сих…\nполучит свою награду»',
      en: '«Whoever helps\none of these little ones…\nshall receive his reward»',
    },
    brandGradient: 'linear-gradient(135deg, #2d1b4e 0%, #5b2d8e 50%, #AF52DE 100%)',
    shortDesc: {
      ua: 'Раз на місяць їдемо послужити людям з інвалідністю — співаємо, читаємо Біблію та п\'ємо чай.',
      ru: 'Раз в месяц едем послужить людям с инвалидностью — поём, читаем Библию и пьём чай.',
      en: 'Once a month we go to serve people with disabilities — we sing, read the Bible and drink tea.',
    },
    fullDesc: {
      ua: 'Раз на місяць наша команда вирушає на спеціальні локації, щоб послужити людям з інвалідністю. Ми разом співаємо пісні хвали, читаємо Біблію, проповідуємо Слово Боже — і звичайно ж п\'ємо чай! 🍵 Це служіння нагадує нам, що любов Христа не знає меж і кожна людина гідна уваги, турботи та Євангелія.',
      ru: 'Раз в месяц наша команда отправляется на специальные локации, чтобы послужить людям с инвалидностью. Мы вместе поём песни хвалы, читаем Библию, проповедуем Слово Божье — и конечно же пьём чай! 🍵 Это служение напоминает нам, что любовь Христа не знает границ и каждый человек достоин внимания, заботы и Евангелия.',
      en: 'Once a month our team goes to special locations to serve people with disabilities. We sing worship songs together, read the Bible, preach the Word of God — and of course drink tea! 🍵 This ministry reminds us that the love of Christ knows no bounds and every person deserves attention, care and the Gospel.',
    },
  },
  {
    id: 'ev-2',
    title: { ua: 'Молодіжний табір', ru: 'Молодёжный лагерь', en: 'Youth Camp' },
    date: { ua: '4–8 серпня 2026', ru: '4–8 августа 2026', en: 'August 4–8, 2026' },
    address: 'Stadskanaal, Netherlands',
    badge: { ua: 'Табір', ru: 'Лагерь', en: 'Camp' },
    color: '#FF7F50',
    brandName: {
      ua: "ОБ'ЄДНАНІ\nПРОБУДЖЕННЯМ",
      ru: 'ОБЪЕДИНЁННЫЕ\nПРОБУЖДЕНИЕМ',
      en: 'UNITED BY\nREVIVAL',
    },
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
