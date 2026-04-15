import type { Localized } from '@/i18n/translations';

export type BlogTag = 'general' | 'youth' | 'recordings';

export interface BlogPost {
  id: string;
  date: string;
  tags: BlogTag[];
  photos?: string[];
  videos?: string[];
  title: Localized;
  body: Localized;
}

export const blogPosts: BlogPost[] = [
  {
    id: 'blog-youth-2026-04-12',
    date: '2026-04-12',
    tags: ['youth'],
    photos: [
      'https://i.ibb.co/KzKPN1d9/1.jpg',
      'https://i.ibb.co/zHNT5n64/2.jpg',
    ],
    title: {
      ua: 'Молодіжка 🔥',
      ru: 'Молодёжка 🔥',
      en: 'Youth Meeting 🔥',
      nl: 'Jeugdavond 🔥',
      es: 'Reunión de Jóvenes 🔥',
    },
    body: {
      ua: 'Наша чергова молодіжка пройшла як завжди класно! Слухали свідчення, проповідували один одному, співали пісні та грали в гру — потрібно було вгадати вірш із Писання або персонажа по емодзі 👀🙏👎😈 Вгадаєте що за вірш? 😄 Ну а ще в одного з братів хотіли забрати машину на штрафстоянку — але все обійшлося 🙏 Не без молитви! :)',
      ru: 'Наша очередная молодёжка прошла как всегда классно! Слушали свидетельства, проповедовали друг другу, пели песни и играли в игру — нужно было угадать стих из Писания или персонажа по эмодзи 👀🙏👎😈 Угадаете что за стих? 😄 Ну а ещё у одного из братьев хотели забрать машину на штрафстоянку — но всё обошлось 🙏 Не без молитвы! :)',
      en: 'Our regular youth meeting was awesome as always! We listened to testimonies, preached to each other, sang songs and played a game — you had to guess a Bible verse or character from emojis 👀🙏👎😈 Can you guess which verse it is? 😄 Oh, and one of our brothers almost had his car towed — but everything worked out 🙏 Not without prayer! :)',
      nl: 'Onze vaste jeugdavond was weer geweldig! We luisterden naar getuigenissen, preekten voor elkaar, zongen liederen en speelden een spel — je moest een Bijbelvers of personage raden aan de hand van emoji\'s 👀🙏👎😈 Raad jij welk vers het is? 😄 En een van onze broeders zou zijn auto bijna laten wegslepen — maar alles kwam goed 🙏 Niet zonder gebed! :)',
      es: '¡Nuestra reunión de jóvenes habitual fue increíble como siempre! Escuchamos testimonios, nos predicamos mutuamente, cantamos canciones y jugamos un juego — había que adivinar un versículo bíblico o personaje por emojis 👀🙏👎😈 ¿Adivinas qué versículo es? 😄 Y a uno de nuestros hermanos casi le remolcan el coche — pero todo salió bien 🙏 ¡No sin oración! :)',
    },
  },
  {
    id: 'blog-picnic-2026-07-06',
    date: '2026-04-06',
    tags: ['general'],
    photos: [
      'https://i.ibb.co/WvMWFRLG/image.jpg',
      'https://i.ibb.co/fzD7jng1/2.jpg',
      'https://i.ibb.co/pr2pjKbc/3.jpg',
      'https://i.ibb.co/prkYRZFH/1.jpg',
    ],
    title: {
      ua: 'Церковний пікнік 🌿',
      ru: 'Церковный пикник 🌿',
      en: 'Church Picnic 🌿',
      nl: 'Kerkpicknick 🌿',
      es: 'Pícnic de la Iglesia 🌿',
    },
    body: {
      ua: 'Зібралися церквою у прекрасний сонячний благословенний день! Смажили мʼясо, грали у волейбол, прославляли Бога! Поки весна і літо дозволяють — будемо влаштовувати такі вилазки частіше!',
      ru: 'Собрались церковью в прекрасный солнечный благословенный день! Жарили мясо, играли в волейбол, прославляли Бога! Пока весна и лето позволяют — будем устраивать такие вылазки чаще!',
      en: 'We gathered as a church on a beautiful sunny blessed day! Grilled meat, played volleyball, praised God! While spring and summer allow it — we will make such outings more often!',
      nl: 'We kwamen samen als kerk op een prachtige zonnige gezegende dag! Vlees gegrild, volleybal gespeeld, God geprezen! Zolang de lente en zomer het toelaten — doen we dit vaker!',
      es: '¡Nos reunimos como iglesia en un hermoso día soleado y bendecido! Asamos carne, jugamos voleibol, alabamos a Dios. ¡Mientras la primavera y el verano lo permitan, haremos estas salidas con más frecuencia!',
    },
  },
  {
    id: 'blog-huizen-2026-04-07',
    date: '2026-04-07',
    tags: ['general'],
    photos: ['https://i.ibb.co/Q37WJhFH/2.jpg'],
    title: {
      ua: 'Церква Emmanuil на локації для людей з інвалідністю в місті Huizen',
      ru: 'Церковь Emmanuil на локации для людей с инвалидностью в городе Huizen',
      en: 'Emmanuil Church at the disability care location in Huizen',
      nl: 'Emmanuil Kerk bij de zorglocatie in Huizen',
      es: 'Iglesia Emmanuil en la residencia de discapacidad en Huizen',
    },
    body: {
      ua: 'Ми відвідали наших друзів на локації в місті Huizen — співали пісні, ділилися Словом, провели хлібопреломлення. Сестра Надія показала близько 30 картин ручної вишивки — неймовірний Богом даний талант! Плануємо майбутню виставку в церкві з її свідченням.',
      ru: 'Мы посетили наших друзей на локации в городе Huizen — пели песни, делились Словом, провели хлебопреломление. Сестра Надежда показала около 30 картин ручной вышивки — невероятный Богом данный талант! Планируем будущую выставку в церкви с её свидетельством.',
      en: 'We visited our friends at the care location in Huizen — sang songs, shared the Word, had communion. Sister Nadezhda showed about 30 hand-embroidery paintings — an incredible God-given talent! We are planning a future exhibition at the church with her testimony.',
      nl: 'We bezochten onze vrienden bij de zorglocatie in Huizen — zongen liederen, deelden het Woord, vierden het Avondmaal. Zuster Nadezjda liet zo\'n 30 handgeborduurde schilderijen zien — een ongelooflijk door God gegeven talent! We plannen een toekomstige tentoonstelling in de kerk met haar getuigenis.',
      es: 'Visitamos a nuestros amigos en la residencia de Huizen — cantamos, compartimos la Palabra, celebramos la comunión. La hermana Nadezhda mostró unas 30 pinturas bordadas a mano — ¡un increíble talento dado por Dios! Planeamos una futura exposición en la iglesia con su testimonio.',
    },
  },
];
