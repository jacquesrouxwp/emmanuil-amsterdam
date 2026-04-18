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
  // ── Amsterdam (5 churches) ────────────────────────────────────────
  {
    id: 'emmanuil-amsterdam',
    name: 'Emmanuil Amsterdam',
    city: 'Amsterdam', country: 'Netherlands',
    address: 'Javastraat 118, Amsterdam',
    lat: 52.3657, lng: 4.9295,
    schedule: 'Неділя 17:00',
    telegram: 'https://t.me/myconclaw_bot/app',
    language: ['ua', 'ru', 'en', 'nl'],
  },
  {
    id: 'grace-amsterdam',
    name: 'Grace Community Amsterdam',
    city: 'Amsterdam', country: 'Netherlands',
    address: 'Plantage Middenlaan 2, Amsterdam',
    lat: 52.3665, lng: 4.9102,
    schedule: 'Неділя 10:30',
    language: ['en', 'nl'],
  },
  {
    id: 'living-word-amsterdam',
    name: 'Living Word Church',
    city: 'Amsterdam', country: 'Netherlands',
    address: 'Bilderdijkstraat 180, Amsterdam',
    lat: 52.3710, lng: 4.8720,
    schedule: 'Неділя 11:00',
    language: ['en', 'nl', 'ru'],
  },
  {
    id: 'hope-amsterdam',
    name: 'Hope Church Amsterdam',
    city: 'Amsterdam', country: 'Netherlands',
    address: 'Rijnstraat 67, Amsterdam',
    lat: 52.3520, lng: 4.9015,
    schedule: 'Субота 18:00',
    language: ['nl', 'en'],
  },
  {
    id: 'new-life-amsterdam',
    name: 'New Life Fellowship',
    city: 'Amsterdam', country: 'Netherlands',
    address: 'Churchillaan 21, Amsterdam',
    lat: 52.3480, lng: 4.8780,
    schedule: 'Неділя 12:00',
    language: ['en', 'ua'],
  },

  // ── Netherlands ───────────────────────────────────────────────────
  { id: 'rotterdam-1', name: 'Slovo Rotterdam', city: 'Rotterdam', country: 'Netherlands', address: 'Schiedamse Vest 80, Rotterdam', lat: 51.9225, lng: 4.4792, schedule: 'Неділя 11:00', language: ['ua', 'ru'] },
  { id: 'hague-1', name: 'Evangelical Church Den Haag', city: 'The Hague', country: 'Netherlands', address: 'Laan van NOI 11, Den Haag', lat: 52.0705, lng: 4.3007, schedule: 'Неділя 10:00', language: ['nl', 'en'] },
  { id: 'utrecht-1', name: 'City Church Utrecht', city: 'Utrecht', country: 'Netherlands', address: 'Lange Viestraat 2B, Utrecht', lat: 52.0907, lng: 5.1214, schedule: 'Неділя 10:30', language: ['nl', 'en', 'ua'] },
  { id: 'eindhoven-1', name: 'Lighthouse Eindhoven', city: 'Eindhoven', country: 'Netherlands', address: 'Mathildelaan 1, Eindhoven', lat: 51.4416, lng: 5.4697, schedule: 'Неділя 11:00', language: ['nl', 'en'] },
  { id: 'almere-1', name: 'Слово Almere', city: 'Almere', country: 'Netherlands', address: 'Best Western Plaza, Almere', lat: 52.3702, lng: 5.2173, schedule: 'Четвер 19:00', language: ['ua', 'ru'] },

  // ── Germany ───────────────────────────────────────────────────────
  { id: 'berlin-1', name: 'Evangelical Church Berlin', city: 'Berlin', country: 'Germany', address: 'Potsdamer Str. 98, Berlin', lat: 52.5200, lng: 13.4050, schedule: 'Неділя 11:00', language: ['de', 'en', 'ru'] },
  { id: 'berlin-2', name: 'Gemeinde der Hoffnung', city: 'Berlin', country: 'Germany', address: 'Müllerstraße 24, Berlin', lat: 52.5480, lng: 13.3630, schedule: 'Неділя 10:00', language: ['de', 'ua'] },
  { id: 'hamburg-1', name: 'Word of Life Hamburg', city: 'Hamburg', country: 'Germany', address: 'Billhorner Röhrendamm 8, Hamburg', lat: 53.5511, lng: 10.0014, schedule: 'Неділя 10:30', language: ['de', 'en', 'ru'] },
  { id: 'munich-1', name: 'Grace Church München', city: 'Munich', country: 'Germany', address: 'Rosenheimer Str. 5, München', lat: 48.1351, lng: 11.5820, schedule: 'Неділя 11:00', language: ['de', 'ua', 'en'] },
  { id: 'frankfurt-1', name: 'Living Hope Frankfurt', city: 'Frankfurt', country: 'Germany', address: 'Hanauer Landstraße 131, Frankfurt', lat: 50.1109, lng: 8.6821, schedule: 'Неділя 10:00', language: ['de', 'ru', 'ua'] },
  { id: 'cologne-1', name: 'Gemeinde Köln', city: 'Cologne', country: 'Germany', address: 'Deutzer Freiheit 77, Köln', lat: 50.9333, lng: 6.9602, schedule: 'Неділя 10:30', language: ['de', 'ua'] },

  // ── UK ────────────────────────────────────────────────────────────
  { id: 'london-1', name: 'Emmanuel Church London', city: 'London', country: 'UK', address: 'Tollington Park 2, London', lat: 51.5711, lng: -0.1073, schedule: 'Неділя 11:00', language: ['en', 'ua', 'ru'] },
  { id: 'london-2', name: 'Slavic Evangelical Church', city: 'London', country: 'UK', address: 'Harrow Road 55, London', lat: 51.5200, lng: -0.2060, schedule: 'Неділя 14:00', language: ['ua', 'ru'] },
  { id: 'manchester-1', name: 'City Church Manchester', city: 'Manchester', country: 'UK', address: 'Oxford Road 141, Manchester', lat: 53.4808, lng: -2.2426, schedule: 'Неділя 10:30', language: ['en', 'ua'] },
  { id: 'birmingham-1', name: 'New Hope Birmingham', city: 'Birmingham', country: 'UK', address: 'Broad Street 1, Birmingham', lat: 52.4862, lng: -1.8904, schedule: 'Неділя 11:00', language: ['en', 'ru'] },

  // ── Poland ────────────────────────────────────────────────────────
  { id: 'warsaw-1', name: 'Kościół Chwały Warszawa', city: 'Warsaw', country: 'Poland', address: 'Aleje Jerozolimskie 44, Warszawa', lat: 52.2297, lng: 21.0122, schedule: 'Неділя 10:00', language: ['pl', 'ua', 'ru'] },
  { id: 'warsaw-2', name: 'Ukraińska Wspólnota Warszawa', city: 'Warsaw', country: 'Poland', address: 'ul. Zielna 39, Warszawa', lat: 52.2350, lng: 20.9850, schedule: 'Неділя 14:00', language: ['ua', 'pl'] },
  { id: 'krakow-1', name: 'Church of the Rock Kraków', city: 'Kraków', country: 'Poland', address: 'ul. Grodzka 52, Kraków', lat: 50.0647, lng: 19.9450, schedule: 'Неділя 10:30', language: ['pl', 'ua'] },
  { id: 'wroclaw-1', name: 'Evangelical Church Wrocław', city: 'Wrocław', country: 'Poland', address: 'ul. Świdnicka 9, Wrocław', lat: 51.1079, lng: 17.0385, schedule: 'Неділя 11:00', language: ['pl', 'ua', 'ru'] },

  // ── Ukraine ───────────────────────────────────────────────────────
  { id: 'kyiv-1', name: 'Церква Еммануїл Київ', city: 'Kyiv', country: 'Ukraine', address: 'вул. Хрещатик 15, Київ', lat: 50.4501, lng: 30.5234, schedule: 'Неділя 10:00', language: ['ua'] },
  { id: 'lviv-1', name: 'Церква Слово Істини Львів', city: 'Lviv', country: 'Ukraine', address: 'пл. Ринок 1, Львів', lat: 49.8397, lng: 24.0297, schedule: 'Неділя 10:30', language: ['ua'] },
  { id: 'kharkiv-1', name: 'Харків Євангельська', city: 'Kharkiv', country: 'Ukraine', address: 'пр. Науки 45, Харків', lat: 49.9935, lng: 36.2304, schedule: 'Неділя 11:00', language: ['ua', 'ru'] },

  // ── France ────────────────────────────────────────────────────────
  { id: 'paris-1', name: 'Église Évangélique Paris', city: 'Paris', country: 'France', address: 'Rue de Rivoli 88, Paris', lat: 48.8566, lng: 2.3522, schedule: 'Неділя 10:30', language: ['fr', 'ua', 'en'] },
  { id: 'paris-2', name: 'Communauté Ukrainienne Paris', city: 'Paris', country: 'France', address: 'Rue de la Victoire 44, Paris', lat: 48.8750, lng: 2.3300, schedule: 'Неділя 14:00', language: ['ua', 'fr'] },
  { id: 'lyon-1', name: 'Église de la Grâce Lyon', city: 'Lyon', country: 'France', address: 'Place Bellecour, Lyon', lat: 45.7640, lng: 4.8357, schedule: 'Неділя 10:00', language: ['fr', 'ua'] },

  // ── Spain ─────────────────────────────────────────────────────────
  { id: 'madrid-1', name: 'Iglesia Emmanuelle Madrid', city: 'Madrid', country: 'Spain', address: 'Gran Vía 45, Madrid', lat: 40.4168, lng: -3.7038, schedule: 'Неділя 11:00', language: ['es', 'ua', 'ru'] },
  { id: 'barcelona-1', name: 'Iglesia Gracia Barcelona', city: 'Barcelona', country: 'Spain', address: 'Las Ramblas 77, Barcelona', lat: 41.3851, lng: 2.1734, schedule: 'Неділя 11:30', language: ['es', 'ua'] },

  // ── Italy ─────────────────────────────────────────────────────────
  { id: 'rome-1', name: 'Chiesa Evangelica Roma', city: 'Rome', country: 'Italy', address: 'Via del Corso 14, Roma', lat: 41.9028, lng: 12.4964, schedule: 'Неділя 10:30', language: ['it', 'ua', 'ru'] },
  { id: 'milan-1', name: 'Chiesa della Speranza Milano', city: 'Milan', country: 'Italy', address: 'Via Torino 40, Milano', lat: 45.4654, lng: 9.1859, schedule: 'Неділя 11:00', language: ['it', 'ua'] },

  // ── Scandinavia ───────────────────────────────────────────────────
  { id: 'stockholm-1', name: 'Evangelisk Kyrka Stockholm', city: 'Stockholm', country: 'Sweden', address: 'Drottninggatan 89, Stockholm', lat: 59.3293, lng: 18.0686, schedule: 'Неділя 11:00', language: ['sv', 'ua', 'en'] },
  { id: 'oslo-1', name: 'Evangelisk Kirke Oslo', city: 'Oslo', country: 'Norway', address: 'Karl Johans gate 37, Oslo', lat: 59.9139, lng: 10.7522, schedule: 'Неділя 11:00', language: ['no', 'ua', 'ru'] },
  { id: 'copenhagen-1', name: 'Evangelisk Kirke København', city: 'Copenhagen', country: 'Denmark', address: 'Strøget 14, København', lat: 55.6761, lng: 12.5683, schedule: 'Неділя 10:30', language: ['da', 'ua'] },
  { id: 'helsinki-1', name: 'Evankelinen Kirkko Helsinki', city: 'Helsinki', country: 'Finland', address: 'Aleksanterinkatu 52, Helsinki', lat: 60.1699, lng: 24.9384, schedule: 'Неділя 11:00', language: ['fi', 'ua', 'ru'] },

  // ── Baltics ───────────────────────────────────────────────────────
  { id: 'tallinn-1', name: 'Evangelical Church Tallinn', city: 'Tallinn', country: 'Estonia', address: 'Viru 12, Tallinn', lat: 59.4370, lng: 24.7536, schedule: 'Неділя 11:00', language: ['et', 'ua', 'ru'] },
  { id: 'riga-1', name: 'Evaņģēliskā draudze Rīga', city: 'Riga', country: 'Latvia', address: 'Brīvības iela 85, Rīga', lat: 56.9496, lng: 24.1052, schedule: 'Неділя 10:30', language: ['lv', 'ua', 'ru'] },
  { id: 'vilnius-1', name: 'Evangelikų Bažnyčia Vilnius', city: 'Vilnius', country: 'Lithuania', address: 'Gedimino pr. 28, Vilnius', lat: 54.6872, lng: 25.2797, schedule: 'Неділя 11:00', language: ['lt', 'ua', 'ru'] },

  // ── Central Europe ────────────────────────────────────────────────
  { id: 'vienna-1', name: 'Evangelische Gemeinde Wien', city: 'Vienna', country: 'Austria', address: 'Kärntner Str. 45, Wien', lat: 48.2082, lng: 16.3738, schedule: 'Неділя 10:30', language: ['de', 'ua', 'ru'] },
  { id: 'prague-1', name: 'Evangelická Církev Praha', city: 'Prague', country: 'Czech Republic', address: 'Václavské nám. 28, Praha', lat: 50.0755, lng: 14.4378, schedule: 'Неділя 11:00', language: ['cs', 'ua', 'ru'] },
  { id: 'budapest-1', name: 'Evangélikus Egyház Budapest', city: 'Budapest', country: 'Hungary', address: 'Andrássy út 60, Budapest', lat: 47.4979, lng: 19.0402, schedule: 'Неділя 10:00', language: ['hu', 'ua', 'ru'] },
  { id: 'brussels-1', name: 'Église Évangélique Bruxelles', city: 'Brussels', country: 'Belgium', address: 'Grand-Place 14, Bruxelles', lat: 50.8503, lng: 4.3517, schedule: 'Неділя 11:00', language: ['fr', 'nl', 'ua'] },
  { id: 'zurich-1', name: 'Evangelische Gemeinde Zürich', city: 'Zürich', country: 'Switzerland', address: 'Bahnhofstrasse 70, Zürich', lat: 47.3769, lng: 8.5417, schedule: 'Неділя 10:30', language: ['de', 'ua', 'en'] },
  { id: 'bucharest-1', name: 'Biserica Evanghelică București', city: 'Bucharest', country: 'Romania', address: 'Calea Victoriei 12, București', lat: 44.4268, lng: 26.1025, schedule: 'Неділя 10:00', language: ['ro', 'ua', 'ru'] },

  // ── South Europe ─────────────────────────────────────────────────
  { id: 'lisbon-1', name: 'Igreja Evangélica Lisboa', city: 'Lisbon', country: 'Portugal', address: 'Av. da Liberdade 110, Lisboa', lat: 38.7223, lng: -9.1393, schedule: 'Неділя 11:00', language: ['pt', 'ua', 'en'] },
  { id: 'athens-1', name: 'Evangelical Church Athens', city: 'Athens', country: 'Greece', address: 'Syntagma Square 3, Athens', lat: 37.9838, lng: 23.7275, schedule: 'Неділя 11:00', language: ['el', 'ua', 'ru', 'en'] },
  { id: 'dublin-1', name: 'Evangelical Church Dublin', city: 'Dublin', country: 'Ireland', address: "O'Connell Street 22, Dublin", lat: 53.3498, lng: -6.2603, schedule: 'Неділя 10:30', language: ['en', 'ua'] },
];
