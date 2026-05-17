export type PostType = 'update' | 'discussion' | 'prayer' | 'resource' | 'project' | 'offer';

export interface CommunityPost {
  id: string;
  type: PostType;
  authorId: string;
  authorName: string;
  authorRole: string;
  date: string;
  title: string;
  body: string;
  photos?: string[];
  likeCount?: number;
  commentCount?: number;
}

export const communityPosts: CommunityPost[] = [
  {
    id: 'cp-1',
    type: 'discussion',
    authorId: 'm-04',
    authorName: 'Дмитро Соколов',
    authorRole: 'Служитель',
    date: '2026-05-16T10:30:00Z',
    title: 'Яку книгу Біблії ви читаєте цього місяця?',
    body: 'Діліться своїми думками та відкриттями! Я зараз читаю Послання до Римлян і знаходжу нові глибини кожен день. Особливо глава 8 вражає — "немає тепер жодного засудження тим, хто в Христі Ісусі".',
    likeCount: 14,
    commentCount: 7,
  },
  {
    id: 'cp-2',
    type: 'prayer',
    authorId: 'm-11',
    authorName: 'Тетяна Лисенко',
    authorRole: 'Член',
    date: '2026-05-15T18:00:00Z',
    title: 'Прошу молитви за маму',
    body: 'Дорогі брати і сестри, прошу молитви за мою маму — вона в лікарні вже тиждень. Вірю у силу молитви нашої спільноти! 🙏',
    likeCount: 23,
    commentCount: 12,
  },
  {
    id: 'cp-3',
    type: 'update',
    authorId: 'm-01',
    authorName: 'Сергій Коваль',
    authorRole: 'Пастор',
    date: '2026-05-14T09:00:00Z',
    title: 'Нові домашні групи відкриваються в червні!',
    body: 'Раді оголосити про три нових домашніх групи в районах Noord, Oost та Nieuw-West. Реєстрація вже відкрита — записуйтесь найближчим часом через сторінку груп.',
    likeCount: 31,
    commentCount: 5,
  },
  {
    id: 'cp-4',
    type: 'resource',
    authorId: 'm-09',
    authorName: 'Марія Шевченко',
    authorRole: 'Член',
    date: '2026-05-13T14:20:00Z',
    title: 'Відмінна проповідь про Псалом 23',
    body: 'Знайшла дуже глибоку проповідь — "Господь Пастир мій". 45 хвилин, але варто кожної секунди. Рекомендую всім, хто шукає заспокоєння у важких часах. Посилання в коментарях.',
    likeCount: 18,
    commentCount: 3,
  },
  {
    id: 'cp-5',
    type: 'project',
    authorId: 'm-03',
    authorName: 'Ігор Козлов',
    authorRole: 'Служитель',
    date: '2026-05-12T11:00:00Z',
    title: 'Різдвяна євангелізація 2026 — формуємо команду',
    body: 'Плануємо велику різдвяну акцію в Амстердамі у грудні. Потрібні: ведучі, музиканти, координатори та перекладачі. Якщо готові служити — відгукуйтесь в коментарях або пишіть особисто!',
    likeCount: 26,
    commentCount: 9,
  },
  {
    id: 'cp-6',
    type: 'offer',
    authorId: 'm-10',
    authorName: 'Олексій Бойко',
    authorRole: 'Член',
    date: '2026-05-11T08:00:00Z',
    title: 'Підвезу на служіння з Oost',
    body: 'Їду на кожне недільне служіння з района Oost (від Wibautstraat). Є 2 вільних місця в машині. Пишіть особисто — будемо добиратися разом!',
    likeCount: 11,
    commentCount: 4,
  },
  {
    id: 'cp-7',
    type: 'discussion',
    authorId: 'm-07',
    authorName: 'Олена Крилова',
    authorRole: 'Член',
    date: '2026-05-10T20:00:00Z',
    title: 'Як організуєте щоденне читання Біблії?',
    body: 'Цікаво дізнатися про ваш досвід — чи є у вас певний план читання? Я використовую план "Біблія за рік" і це дуже допомагає підтримувати духовну дисципліну.',
    likeCount: 16,
    commentCount: 11,
  },
  {
    id: 'cp-8',
    type: 'prayer',
    authorId: 'm-13',
    authorName: 'Катерина Руденко',
    authorRole: 'Член',
    date: '2026-05-09T15:00:00Z',
    title: 'Подяка Богу — молитва відповіла! 🙌',
    body: 'Три тижні тому просила молитви про роботу. Бог почув! Отримала пропозицію своєї мрії. Дякую всім хто молився! Богу слава і честь!',
    likeCount: 45,
    commentCount: 18,
  },
  {
    id: 'cp-9',
    type: 'resource',
    authorId: 'm-02',
    authorName: 'Анна Петрова',
    authorRole: 'Служитель',
    date: '2026-05-08T12:00:00Z',
    title: 'Пісні для домашнього поклоніння',
    body: 'Зібрала плейлист із 20 пісень для особистого поклоніння та домашніх груп — всі зі словами на україньскій. Дуже допомагає входити в Божу присутність вдома.',
    likeCount: 29,
    commentCount: 6,
  },
  {
    id: 'cp-10',
    type: 'project',
    authorId: 'm-05',
    authorName: 'Наталія Волкова',
    authorRole: 'Служитель',
    date: '2026-05-07T10:00:00Z',
    title: 'Дитячий табір влітку — шукаємо волонтерів',
    body: 'Плануємо літній табір для дітей 7-14 років в серпні. Потрібні вожаті, кухарі та організатори заходів. Участь безкоштовна для дітей із сімей нашої церкви.',
    likeCount: 34,
    commentCount: 15,
  },
];
