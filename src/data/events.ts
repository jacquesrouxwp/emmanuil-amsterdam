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
  photo?: string;
  link?: string;
}

export const upcomingEvents: ChurchEvent[] = [
  // 1. Emmanuil Church — always EN
  {
    id: 'ev-1',
    title: { ua: 'Хрещення', ru: 'Крещение', en: 'Baptism' },
    date: { ua: '19 квітня 2026', ru: '19 апреля 2026', en: 'April 19, 2026' },
    time: '17:00',
    address: 'Javastraat 118, Amsterdam',
    badge: { ua: 'Свято', ru: 'Праздник', en: 'Celebration' },
    color: '#5E9ED6',
    brandName: { ua: 'ХРЕЩЕННЯ', ru: 'КРЕЩЕНИЕ', en: 'BAPTISM' },
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

  // 2. United Revival — always EN
  {
    id: 'ev-2',
    title: { ua: 'Молодіжний табір', ru: 'Молодёжный лагерь', en: 'Youth Camp' },
    date: { ua: '4–8 серпня 2026', ru: '4–8 августа 2026', en: 'August 4–8, 2026' },
    address: 'Stadskanaal, Netherlands',
    badge: { ua: 'Табір', ru: 'Лагерь', en: 'Camp' },
    color: '#FF7F50',
    brandName: { ua: 'UNITED\nREVIVAL', ru: 'UNITED\nREVIVAL', en: 'UNITED\nREVIVAL' },
    brandGradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    shortDesc: {
      ua: "Табір для української молоді з Європи — «Об'єднані пробудженням».",
      ru: "Лагерь для украинской молодёжи из Европы — «Объединённые пробуждением».",
      en: "Camp for Ukrainian youth from Europe — \"United by Revival\".",
    },
    fullDesc: {
      ua: "«Об'єднані пробудженням» — табір для української молоді (16+) з Європи та Америки, організований церквами з Бельгії, Нідерландів та США. 5 днів молитви, вивчення Біблії, спілкування та відпочинку. Спікери: Ярослав Ярошенко, Валентин Ярошенко, Богдан Коновалов, Віталій Жиляк. На території: басейн, волейбол, баскетбол, теніс. Проживання в кімнатах по 3–6 осіб, триразове харчування включено.",
      ru: "«Объединённые пробуждением» — лагерь для украинской молодёжи (16+) из Европы и Америки, организованный церквями из Бельгии, Нидерландов и США. 5 дней молитвы, изучения Библии, общения и отдыха. Спикеры: Ярослав Ярошенко, Валентин Ярошенко, Богдан Коновалов, Виталий Жиляк. На территории: бассейн, волейбол, баскетбол, теннис. Проживание в комнатах по 3–6 человек, трёхразовое питание включено.",
      en: "\"United by Revival\" — a camp for Ukrainian youth (16+) from Europe and America, organised by churches from Belgium, the Netherlands and the USA. 5 days of prayer, Bible study, fellowship and recreation. Speakers: Yaroslav Yaroshenko, Valentin Yaroshenko, Bohdan Konovalov, Vitaliy Zhyliak. Facilities: swimming pool, volleyball, basketball, tennis. Accommodation in rooms of 3–6 people, three meals a day included.",
    },
    photo: 'https://emmanuil-united-revival.vercel.app/_next/image?url=%2Fimages%2Flocation%2Fgreen-zone.jpg&w=1920&q=75',
    link: 'https://emmanuil-united-revival.vercel.app',
  },

  // 3. Disability ministry — text changes with language
  {
    id: 'ev-disability',
    title: { ua: 'Служіння для людей з інвалідністю', ru: 'Служение для людей с инвалидностью', en: 'Ministry for People with Disabilities' },
    date: { ua: 'Раз на місяць', ru: 'Раз в месяц', en: 'Once a month' },
    address: 'Amsterdam & Netherlands',
    badge: { ua: 'Місія', ru: 'Миссия', en: 'Mission' },
    color: '#AF52DE',
    brandName: {
      ua: '...оскільки ви зробили це\nодному з найменших братів\nМоїх — ви зробили це Мені',
      ru: '...так как вы сделали это\nодному из сих братьев\nМоих меньших, то сделали Мне',
      en: '...as you did it to one\nof the least of these\nMy brothers, you did it to Me',
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
];
