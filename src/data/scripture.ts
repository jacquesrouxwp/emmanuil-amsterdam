import type { Lang } from '@/i18n/translations';

export interface LocalizedScripture {
  text: { ua: string; ru: string; en: string; nl?: string; es?: string };
  reference: { ua: string; ru: string; en: string; nl?: string; es?: string };
}

export const dailyScriptures: LocalizedScripture[] = [
  {
    text: {
      ua: 'Бо так полюбив Бог світ, що дав Сина Свого Єдинородного, щоб кожен, хто вірує в Нього, не загинув, але мав вічне життя.',
      ru: 'Ибо так возлюбил Бог мир, что отдал Сына Своего Единородного, дабы всякий, верующий в Него, не погиб, но имел жизнь вечную.',
      en: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
      nl: 'Want zo lief heeft God de wereld gehad, dat Hij zijn eniggeboren Zoon gegeven heeft, opdat ieder die in Hem gelooft niet verloren gaat, maar eeuwig leven heeft.',
      es: 'Porque tanto amó Dios al mundo, que dio a su Hijo unigénito, para que todo el que cree en él no se pierda, sino que tenga vida eterna.',
    },
    reference: { ua: 'Івана 3:16', ru: 'Иоанна 3:16', en: 'John 3:16', nl: 'Johannes 3:16', es: 'Juan 3:16' },
  },
  {
    text: {
      ua: 'Господь — Пастир мій; я ні в чому не матиму нестачі.',
      ru: 'Господь — Пастырь мой; я ни в чём не буду нуждаться.',
      en: 'The Lord is my shepherd, I lack nothing.',
      nl: 'De HEER is mijn herder, het ontbreekt mij aan niets.',
      es: 'El Señor es mi pastor; nada me faltará.',
    },
    reference: { ua: 'Псалом 22:1', ru: 'Псалом 22:1', en: 'Psalm 23:1', nl: 'Psalm 23:1', es: 'Salmo 23:1' },
  },
  {
    text: {
      ua: 'Бо тільки Я знаю думки, що маю про вас, — говорить Господь, — думки миру, а не лиха, щоб дати вам майбутнє та надію.',
      ru: 'Ибо только Я знаю намерения, какие имею о вас, говорит Господь, намерения во благо, а не на зло, чтобы дать вам будущность и надежду.',
      en: 'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.',
      nl: 'Want Ik weet welke plannen Ik voor u heb, spreekt de HEER, plannen voor uw welzijn en niet voor uw onheil, om u een toekomst en hoop te geven.',
      es: 'Porque yo sé los planes que tengo para vosotros, declara el Señor, planes de bienestar y no de calamidad, para daros un futuro y una esperanza.',
    },
    reference: { ua: 'Єремія 29:11', ru: 'Иеремия 29:11', en: 'Jeremiah 29:11', nl: 'Jeremia 29:11', es: 'Jeremías 29:11' },
  },
  {
    text: {
      ua: 'Усе можу в Тому, Хто мене зміцнює, — Ісусі Христі.',
      ru: 'Всё могу в укрепляющем меня Иисусе Христе.',
      en: 'I can do all this through him who gives me strength.',
      nl: 'Ik kan alles aan door hem die mij kracht geeft.',
      es: 'Todo lo puedo en Cristo que me fortalece.',
    },
    reference: { ua: 'Филип\'ян 4:13', ru: 'Филиппийцам 4:13', en: 'Philippians 4:13', nl: 'Filippenzen 4:13', es: 'Filipenses 4:13' },
  },
  {
    text: {
      ua: 'Не бійся, бо Я з тобою; не озирайся, бо Я Бог твій; Я зміцню тебе і допоможу тобі.',
      ru: 'Не бойся, ибо Я с тобою; не смущайся, ибо Я Бог твой; Я укреплю тебя, и помогу тебе.',
      en: 'So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you.',
      nl: 'Wees niet bang, want Ik ben bij je; vrees niet, want Ik ben je God. Ik zal je sterken en je helpen.',
      es: 'No temas, porque yo estoy contigo; no te desmayes, porque yo soy tu Dios. Te fortaleceré y te ayudaré.',
    },
    reference: { ua: 'Ісая 41:10', ru: 'Исаия 41:10', en: 'Isaiah 41:10', nl: 'Jesaja 41:10', es: 'Isaías 41:10' },
  },
  {
    text: {
      ua: 'Надійся на Господа всім серцем своїм і не покладайся на власний розум.',
      ru: 'Надейся на Господа всем сердцем твоим, и не полагайся на разум твой.',
      en: 'Trust in the Lord with all your heart and lean not on your own understanding.',
      nl: 'Vertrouw op de HEER met heel je hart en steun niet op je eigen inzicht.',
      es: 'Confía en el Señor con todo tu corazón, y no te apoyes en tu propia prudencia.',
    },
    reference: { ua: 'Приповідки 3:5', ru: 'Притчи 3:5', en: 'Proverbs 3:5', nl: 'Spreuken 3:5', es: 'Proverbios 3:5' },
  },
  {
    text: {
      ua: 'І мир Божий, що перевищує всяке розуміння, збереже серця ваші та думки ваші у Христі Ісусі.',
      ru: 'И мир Божий, который превыше всякого ума, соблюдёт сердца ваши и помышления ваши во Христе Иисусе.',
      en: 'And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.',
      nl: 'En de vrede van God, die alle verstand te boven gaat, zal uw harten en uw gedachten bewaken in Christus Jezus.',
      es: 'Y la paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones y vuestros pensamientos en Cristo Jesús.',
    },
    reference: { ua: 'Филип\'ян 4:7', ru: 'Филиппийцам 4:7', en: 'Philippians 4:7', nl: 'Filippenzen 4:7', es: 'Filipenses 4:7' },
  },
  {
    text: {
      ua: 'Та ми знаємо, що тим, хто любить Бога, хто покликаний за Його задумом, усе сприяє на добро.',
      ru: 'Притом знаем, что любящим Бога, призванным по Его изволению, всё содействует ко благу.',
      en: 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.',
      nl: 'En wij weten dat God alle dingen doet meewerken ten goede voor hen die God liefhebben, voor hen die naar zijn voornemen zijn geroepen.',
      es: 'Y sabemos que a los que aman a Dios, todas las cosas les ayudan a bien, a los que conforme a su propósito son llamados.',
    },
    reference: { ua: 'Римлян 8:28', ru: 'Римлянам 8:28', en: 'Romans 8:28', nl: 'Romeinen 8:28', es: 'Romanos 8:28' },
  },
  {
    text: {
      ua: 'Прийдіть до Мене всі, хто трудиться і обтяжений, і Я заспокою вас.',
      ru: 'Придите ко Мне, все труждающиеся и обременённые, и Я успокою вас.',
      en: 'Come to me, all you who are weary and burdened, and I will give you rest.',
      nl: 'Kom naar Mij toe, allen die vermoeid en belast bent, en Ik zal u rust geven.',
      es: 'Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar.',
    },
    reference: { ua: 'Матвія 11:28', ru: 'Матфея 11:28', en: 'Matthew 11:28', nl: 'Mattheüs 11:28', es: 'Mateo 11:28' },
  },
  {
    text: {
      ua: 'Ісус сказав їй: Я є воскресіння і життя; той, хто вірує в Мене, навіть якщо й помре — оживе.',
      ru: 'Иисус сказал ей: Я есмь воскресение и жизнь; верующий в Меня, если и умрёт, оживёт.',
      en: 'Jesus said to her, "I am the resurrection and the life. The one who believes in me will live, even though they die."',
      nl: 'Jezus zei tegen haar: Ik ben de opstanding en het leven; wie in Mij gelooft, zal leven, ook al is hij gestorven.',
      es: 'Jesús le dijo: Yo soy la resurrección y la vida; el que cree en mí, aunque esté muerto, vivirá.',
    },
    reference: { ua: 'Івана 11:25', ru: 'Иоанна 11:25', en: 'John 11:25', nl: 'Johannes 11:25', es: 'Juan 11:25' },
  },
  {
    text: {
      ua: 'Будьте добрі один до одного, милосердні, прощайте один одному, як і Бог у Христі простив вам.',
      ru: 'Будьте друг ко другу добры, сострадательны, прощайте друг друга, как и Бог во Христе простил вас.',
      en: 'Be kind and compassionate to one another, forgiving each other, just as in Christ God forgave you.',
      nl: 'Wees vriendelijk en liefdevol voor elkaar, en vergeef elkaar zoals God u in Christus vergeven heeft.',
      es: 'Antes sed bondadosos unos con otros, misericordiosos, perdonándoos unos a otros, como Dios también os perdonó en Cristo.',
    },
    reference: { ua: 'Єфесян 4:32', ru: 'Ефесянам 4:32', en: 'Ephesians 4:32', nl: 'Efeziërs 4:32', es: 'Efesios 4:32' },
  },
  {
    text: {
      ua: 'Віра ж — це здійснення очікуваного і впевненість у невидимому.',
      ru: 'Вера же есть осуществление ожидаемого и уверенность в невидимом.',
      en: 'Now faith is confidence in what we hope for and assurance about what we do not see.',
      nl: 'Het geloof nu is de vaste grond van de dingen die men hoopt, en het bewijs van de zaken die men niet ziet.',
      es: 'Es, pues, la fe la certeza de lo que se espera, la convicción de lo que no se ve.',
    },
    reference: { ua: 'Євреїв 11:1', ru: 'Евреям 11:1', en: 'Hebrews 11:1', nl: 'Hebreeën 11:1', es: 'Hebreos 11:1' },
  },
  {
    text: {
      ua: 'Бог є любов, і той, хто перебуває в любові, перебуває в Богові, і Бог — у ньому.',
      ru: 'Бог есть любовь, и пребывающий в любви пребывает в Боге, и Бог в нём.',
      en: 'God is love. Whoever lives in love lives in God, and God in them.',
      nl: 'God is liefde, en wie in de liefde blijft, blijft in God, en God blijft in hem.',
      es: 'Dios es amor; y el que permanece en amor, permanece en Dios, y Dios en él.',
    },
    reference: { ua: 'Перше Івана 4:16', ru: 'Первое Иоанна 4:16', en: '1 John 4:16', nl: '1 Johannes 4:16', es: '1 Juan 4:16' },
  },
  {
    text: {
      ua: 'Бо ви спасені благодаттю через віру, і це не від вас — Божий дар.',
      ru: 'Ибо вы спасены по благодати через веру, и это не от вас, Божий дар.',
      en: 'For it is by grace you have been saved, through faith — and this is not from yourselves, it is the gift of God.',
      nl: 'Want door genade bent u gered, door geloof. En dat niet uit u zelf, het is de gave van God.',
      es: 'Porque por gracia sois salvos por medio de la fe; y esto no de vosotros, pues es don de Dios.',
    },
    reference: { ua: 'Єфесян 2:8', ru: 'Ефесянам 2:8', en: 'Ephesians 2:8', nl: 'Efeziërs 2:8', es: 'Efesios 2:8' },
  },
  {
    text: {
      ua: 'Радійте завжди в Господі; знову кажу: радійте.',
      ru: 'Радуйтесь всегда в Господе; и ещё говорю: радуйтесь.',
      en: 'Rejoice in the Lord always. I will say it again: Rejoice!',
      nl: 'Verblijdt u in de Heer, altijd; nogmaals zal ik zeggen: Verblijdt u!',
      es: '¡Regocijaos en el Señor siempre! Otra vez digo: ¡Regocijaos!',
    },
    reference: { ua: 'Филип\'ян 4:4', ru: 'Филиппийцам 4:4', en: 'Philippians 4:4', nl: 'Filippenzen 4:4', es: 'Filipenses 4:4' },
  },
  {
    text: {
      ua: 'Господь — світло моє і спасіння моє: кого мені боятися?',
      ru: 'Господь — свет мой и спасение моё: кого мне бояться?',
      en: 'The Lord is my light and my salvation — whom shall I fear?',
      nl: 'De HEER is mijn licht en mijn redding, voor wie zou ik bang zijn?',
      es: 'El Señor es mi luz y mi salvación; ¿a quién temeré?',
    },
    reference: { ua: 'Псалом 26:1', ru: 'Псалом 26:1', en: 'Psalm 27:1', nl: 'Psalm 27:1', es: 'Salmo 27:1' },
  },
  {
    text: {
      ua: 'Бо Я Господь, Бог твій, що тримаю тебе за правицю твою, кажу тобі: не бійся, Я допомагаю тобі.',
      ru: 'Ибо Я Господь, Бог твой; держу тебя за правую руку твою, говорю тебе: не бойся, Я помогаю тебе.',
      en: 'For I am the Lord your God who takes hold of your right hand and says to you, Do not fear; I will help you.',
      nl: 'Want Ik ben de HEER, uw God, die uw rechterhand vasthoudt; die tot u zegt: Wees niet bang, Ik help u.',
      es: 'Porque yo Jehová soy tu Dios, quien te sostiene de tu mano derecha, y te digo: No temas, yo te ayudo.',
    },
    reference: { ua: 'Ісая 41:13', ru: 'Исаия 41:13', en: 'Isaiah 41:13', nl: 'Jesaja 41:13', es: 'Isaías 41:13' },
  },
  {
    text: {
      ua: 'Як лань прагне до потоків водних, так прагне душа моя до Тебе, Боже.',
      ru: 'Как лань желает к потокам воды, так желает душа моя к Тебе, Боже.',
      en: 'As the deer pants for streams of water, so my soul pants for you, my God.',
      nl: 'Zoals een hert smacht naar stromend water, zo smacht mijn ziel naar U, o God.',
      es: 'Como el ciervo brama por las corrientes de las aguas, así clama por ti, oh Dios, el alma mía.',
    },
    reference: { ua: 'Псалом 41:2', ru: 'Псалом 41:2', en: 'Psalm 42:1', nl: 'Psalm 42:2', es: 'Salmo 42:1' },
  },
  {
    text: {
      ua: 'Благословлятиму Господа повсякчас; хвала Йому завжди у вустах моїх.',
      ru: 'Благословлю Господа во всякое время; хвала Ему непрестанно в устах моих.',
      en: 'I will extol the Lord at all times; his praise will always be on my lips.',
      nl: 'Ik zal de HEER te allen tijde loven; zijn lof zal voortdurend in mijn mond zijn.',
      es: 'Bendeciré al Señor en todo tiempo; su alabanza estará de continuo en mi boca.',
    },
    reference: { ua: 'Псалом 33:2', ru: 'Псалом 33:2', en: 'Psalm 34:1', nl: 'Psalm 34:2', es: 'Salmo 34:1' },
  },
  {
    text: {
      ua: 'Якщо Бог за нас, то хто проти нас?',
      ru: 'Если Бог за нас, кто против нас?',
      en: 'If God is for us, who can be against us?',
      nl: 'Als God voor ons is, wie kan dan tegen ons zijn?',
      es: 'Si Dios es por nosotros, ¿quién contra nosotros?',
    },
    reference: { ua: 'Римлян 8:31', ru: 'Римлянам 8:31', en: 'Romans 8:31', nl: 'Romeinen 8:31', es: 'Romanos 8:31' },
  },
  {
    text: {
      ua: 'Але ті, що надіються на Господа, оновляться в силі; піднімуть крила, як орли.',
      ru: 'Но те, кто надеется на Господа, обновятся в силе; поднимут крылья, как орлы.',
      en: 'But those who hope in the Lord will renew their strength. They will soar on wings like eagles.',
      nl: 'Maar zij die op de HEER vertrouwen, hervinden hun kracht. Zij slaan hun vleugels uit als arenden.',
      es: 'Pero los que esperan en el Señor renovarán sus fuerzas; levantarán alas como las águilas.',
    },
    reference: { ua: 'Ісая 40:31', ru: 'Исаия 40:31', en: 'Isaiah 40:31', nl: 'Jesaja 40:31', es: 'Isaías 40:31' },
  },
  {
    text: {
      ua: 'Любов довготерпить, милосердиться, любов не заздрить, не чваниться, не надимається.',
      ru: 'Любовь долготерпит, милосердствует, любовь не завидует, не превозносится, не гордится.',
      en: 'Love is patient, love is kind. It does not envy, it does not boast, it is not proud.',
      nl: 'De liefde is geduldig en vriendelijk; de liefde is niet jaloers, zij praalt niet, zij is niet trots.',
      es: 'El amor es sufrido, es benigno; el amor no tiene envidia, no es jactancioso, no se envanece.',
    },
    reference: { ua: 'Перше Коринтян 13:4', ru: 'Первое Коринфянам 13:4', en: '1 Corinthians 13:4', nl: '1 Korintiërs 13:4', es: '1 Corintios 13:4' },
  },
  {
    text: {
      ua: 'Повір у Господа Ісуса Христа, і спасешся ти і дім твій.',
      ru: 'Веруйте в Господа Иисуса Христа, и спасётесь вы и весь дом ваш.',
      en: 'Believe in the Lord Jesus, and you will be saved — you and your household.',
      nl: 'Geloof in de Heere Jezus Christus en u zult zalig worden, u en uw huishouden.',
      es: 'Cree en el Señor Jesucristo, y serás salvo, tú y tu casa.',
    },
    reference: { ua: 'Дії 16:31', ru: 'Деяния 16:31', en: 'Acts 16:31', nl: 'Handelingen 16:31', es: 'Hechos 16:31' },
  },
  {
    text: {
      ua: 'Слово Твоє — світильник для ніг моїх і світло для стежки моєї.',
      ru: 'Слово Твоё — светильник ноге моей и свет стезе моей.',
      en: 'Your word is a lamp for my feet, a light on my path.',
      nl: 'Uw woord is een lamp voor mijn voet en een licht op mijn pad.',
      es: 'Lámpara es a mis pies tu palabra, y lumbrera a mi camino.',
    },
    reference: { ua: 'Псалом 118:105', ru: 'Псалом 118:105', en: 'Psalm 119:105', nl: 'Psalm 119:105', es: 'Salmo 119:105' },
  },
  {
    text: {
      ua: 'Бо де двоє чи троє зібрані в ім\'я Моє, там Я серед них.',
      ru: 'Ибо где двое или трое собраны во имя Моё, там Я посреди них.',
      en: 'For where two or three gather in my name, there am I with them.',
      nl: 'Want waar twee of drie vergaderd zijn in Mijn Naam, daar ben Ik in hun midden.',
      es: 'Porque donde están dos o tres congregados en mi nombre, allí estoy yo en medio de ellos.',
    },
    reference: { ua: 'Матвія 18:20', ru: 'Матфея 18:20', en: 'Matthew 18:20', nl: 'Mattheüs 18:20', es: 'Mateo 18:20' },
  },
  {
    text: {
      ua: 'Пам\'ятай, що Я наказав тобі: будь твердий і мужній, не бійся і не лякайся.',
      ru: 'Помни, что Я повелел тебе: будь твёрд и мужествен, не бойся и не ужасайся.',
      en: 'Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged.',
      nl: 'Heb Ik u niet geboden: wees sterk en moedig? Wees niet bevreesd en wees niet ontsteld, want de HEER, uw God, is met u.',
      es: '¿No te lo he mandado yo? Esfuérzate y sé valiente; no temas ni desmayes, porque el Señor tu Dios estará contigo.',
    },
    reference: { ua: 'Ісус Навин 1:9', ru: 'Иисус Навин 1:9', en: 'Joshua 1:9', nl: 'Jozua 1:9', es: 'Josué 1:9' },
  },
  {
    text: {
      ua: 'Ісус Христос учора і сьогодні — той самий і навіки.',
      ru: 'Иисус Христос вчера и сегодня и вовеки Тот же.',
      en: 'Jesus Christ is the same yesterday and today and forever.',
      nl: 'Jezus Christus is gisteren en heden dezelfde en tot in eeuwigheid.',
      es: 'Jesucristo es el mismo ayer, y hoy, y por los siglos.',
    },
    reference: { ua: 'Євреїв 13:8', ru: 'Евреям 13:8', en: 'Hebrews 13:8', nl: 'Hebreeën 13:8', es: 'Hebreos 13:8' },
  },
  {
    text: {
      ua: 'Близький Господь до всіх, хто кличе Його, до всіх, хто кличе Його в правді.',
      ru: 'Близок Господь ко всем призывающим Его, ко всем призывающим Его в истине.',
      en: 'The Lord is near to all who call on him, to all who call on him in truth.',
      nl: 'De HEER is nabij allen die Hem aanroepen, allen die Hem aanroepen in waarheid.',
      es: 'El Señor está cerca de todos los que le invocan, de todos los que le invocan en verdad.',
    },
    reference: { ua: 'Псалом 144:18', ru: 'Псалом 144:18', en: 'Psalm 145:18', nl: 'Psalm 145:18', es: 'Salmo 145:18' },
  },
  {
    text: {
      ua: 'Він дає силу стомленому і виснаженому дарує міцність.',
      ru: 'Он даёт утомлённому силу и изнемогшему дарует крепость.',
      en: 'He gives strength to the weary and increases the power of the weak.',
      nl: 'Hij geeft de vermoeide kracht en de machteloze groot vermogen.',
      es: 'Él da esfuerzo al cansado, y multiplica las fuerzas al que no tiene ningunas.',
    },
    reference: { ua: 'Ісая 40:29', ru: 'Исаия 40:29', en: 'Isaiah 40:29', nl: 'Jesaja 40:29', es: 'Isaías 40:29' },
  },
  {
    text: {
      ua: 'Нехай благословить тебе Господь і збереже тебе! Нехай осяє тебе Господь лицем Своїм і помилує тебе!',
      ru: 'Да благословит тебя Господь и сохранит тебя! Да призрит на тебя Господь светлым лицом Своим и помилует тебя!',
      en: 'The Lord bless you and keep you; the Lord make his face shine on you and be gracious to you.',
      nl: 'De HEER zegene u en behoede u! De HEER doe zijn aangezicht over u lichten en zij u genadig!',
      es: 'El Señor te bendiga y te guarde; el Señor haga resplandecer su rostro sobre ti, y tenga de ti misericordia.',
    },
    reference: { ua: 'Числа 6:24-25', ru: 'Числа 6:24-25', en: 'Numbers 6:24-25', nl: 'Numeri 6:24-25', es: 'Números 6:24-25' },
  },
  {
    text: {
      ua: 'Шукайте ж перш за все Царства Божого і правди Його, а все це додасться вам.',
      ru: 'Ищите прежде Царства Божия и правды Его, и это всё приложится вам.',
      en: 'But seek first his kingdom and his righteousness, and all these things will be given to you as well.',
      nl: 'Maar zoek eerst het Koninkrijk van God en zijn gerechtigheid, en al deze dingen zullen u erbij gegeven worden.',
      es: 'Mas buscad primeramente el reino de Dios y su justicia, y todas estas cosas os serán añadidas.',
    },
    reference: { ua: 'Матвія 6:33', ru: 'Матфея 6:33', en: 'Matthew 6:33', nl: 'Mattheüs 6:33', es: 'Mateo 6:33' },
  },
  // --- Psalms ---
  {
    text: {
      ua: 'Заспокойтеся і знайте, що Я — Бог; Я піднесений між народами, піднесений на землі.',
      ru: 'Остановитесь и познайте, что Я — Бог; Я буду превознесён в народах, превознесён на земле.',
      en: 'Be still, and know that I am God; I will be exalted among the nations, I will be exalted in the earth.',
      nl: 'Houd op en weet dat Ik God ben; Ik zal verhoogd worden onder de volkeren, Ik zal verhoogd worden op de aarde.',
      es: 'Estad quietos, y conoced que yo soy Dios; seré exaltado entre las naciones; enaltecido seré en la tierra.',
    },
    reference: { ua: 'Псалом 45:11', ru: 'Псалом 45:11', en: 'Psalm 46:10', nl: 'Psalm 46:11', es: 'Salmo 46:10' },
  },
  {
    text: {
      ua: 'Господь — сила моя і щит мій; на Нього надіялося серце моє, і Він допоміг мені.',
      ru: 'Господь — крепость моя и щит мой; на Него уповало сердце моё, и Он помог мне.',
      en: 'The Lord is my strength and my shield; my heart trusts in him, and he helps me.',
      nl: 'De HEER is mijn kracht en mijn schild; op Hem vertrouwde mijn hart, en ik ben geholpen.',
      es: 'El Señor es mi fortaleza y mi escudo; en él confió mi corazón, y fui ayudado.',
    },
    reference: { ua: 'Псалом 27:7', ru: 'Псалом 27:7', en: 'Psalm 28:7', nl: 'Psalm 28:7', es: 'Salmo 28:7' },
  },
  {
    text: {
      ua: 'Звідки прийде мені допомога? Допомога моя від Господа, що сотворив небо і землю.',
      ru: 'Откуда придёт помощь моя? Помощь моя от Господа, сотворившего небо и землю.',
      en: 'Where does my help come from? My help comes from the Lord, the Maker of heaven and earth.',
      nl: 'Ik sla mijn ogen op naar de bergen, vanwaar mijn hulp komen zal. Mijn hulp is van de HEER, die hemel en aarde gemaakt heeft.',
      es: '¿A dónde levantaré mis ojos? Al Señor, de quien viene mi socorro. Mi socorro viene del Señor, que hizo los cielos y la tierra.',
    },
    reference: { ua: 'Псалом 120:1-2', ru: 'Псалом 120:1-2', en: 'Psalm 121:1-2', nl: 'Psalm 121:1-2', es: 'Salmo 121:1-2' },
  },
  {
    text: {
      ua: 'Радуйся Господеві і Він виконає бажання серця твого. Довір Господеві путь свій, надійся на Нього.',
      ru: 'Утешайся Господом, и Он исполнит желания сердца твоего. Предай Господу путь твой и уповай на Него.',
      en: 'Delight yourself in the Lord, and he will give you the desires of your heart. Commit your way to the Lord; trust in him.',
      nl: 'Schep vreugde in de HEER en Hij zal u geven wat uw hart verlangt. Wentel uw weg op de HEER en vertrouw op Hem.',
      es: 'Deléitate asimismo en el Señor, y él te concederá las peticiones de tu corazón. Encomienda al Señor tu camino; confía en él.',
    },
    reference: { ua: 'Псалом 36:4-5', ru: 'Псалом 36:4-5', en: 'Psalm 37:4-5', nl: 'Psalm 37:4-5', es: 'Salmo 37:4-5' },
  },
  {
    text: {
      ua: 'Я прославлю Тебе, бо дивно я створений; дивні діла Твої, і душа моя це добре знає.',
      ru: 'Славлю Тебя, потому что я дивно устроен; дивны дела Твои, и душа моя вполне сознаёт это.',
      en: 'I praise you because I am fearfully and wonderfully made; your works are wonderful, I know that full well.',
      nl: 'Ik loof U omdat ik op ontzagwekkende en wonderbaarlijke wijze gemaakt ben; wonderlijk zijn Uw werken, mijn ziel weet dat heel goed.',
      es: 'Te alabaré; porque formidables, maravillosas son tus obras; estoy maravillado, y mi alma lo sabe muy bien.',
    },
    reference: { ua: 'Псалом 138:14', ru: 'Псалом 138:14', en: 'Psalm 139:14', nl: 'Psalm 139:14', es: 'Salmo 139:14' },
  },
  {
    text: {
      ua: 'Господь — моя скеля і фортеця моя і визволитель мій; Бог мій — твердиня моя, на Нього надіюся.',
      ru: 'Господь — твердыня моя и крепость моя и избавитель мой, Бог мой — скала моя; на Него я уповаю.',
      en: 'The Lord is my rock, my fortress and my deliverer; my God is my rock, in whom I take refuge.',
      nl: 'De HEER is mijn rots, mijn burcht, mijn bevrijder; mijn God, mijn rots bij wie ik schuil.',
      es: 'El Señor es mi roca, mi fortaleza y mi libertador; mi Dios, mi peña en quien me refugio.',
    },
    reference: { ua: 'Псалом 17:3', ru: 'Псалом 17:3', en: 'Psalm 18:2', nl: 'Psalm 18:2', es: 'Salmo 18:2' },
  },
  {
    text: {
      ua: 'Хваліте Господа, бо Він добрий, бо навіки милість Його.',
      ru: 'Славьте Господа, ибо Он благ, ибо вовек милость Его.',
      en: 'Give thanks to the Lord, for he is good; his love endures forever.',
      nl: 'Loof de HEER, want Hij is goed, zijn goedertierenheid is voor eeuwig.',
      es: 'Alabad al Señor, porque él es bueno; porque para siempre es su misericordia.',
    },
    reference: { ua: 'Псалом 106:1', ru: 'Псалом 106:1', en: 'Psalm 107:1', nl: 'Psalm 107:1', es: 'Salmo 107:1' },
  },
  {
    text: {
      ua: 'Хай знайде відраду в Господі сумний; нехай покоряться Йому всі народи землі.',
      ru: 'Ибо Он насытил душу жаждущую и душу алчущую исполнил благами.',
      en: 'He satisfies the thirsty and fills the hungry with good things.',
      nl: 'Want Hij heeft de dorstige ziel verzadigd en de hongerige ziel met het goede gevuld.',
      es: 'Porque él satisface al alma menesterosa, y llena de bien al alma hambrienta.',
    },
    reference: { ua: 'Псалом 106:9', ru: 'Псалом 106:9', en: 'Psalm 107:9', nl: 'Psalm 107:9', es: 'Salmo 107:9' },
  },
  {
    text: {
      ua: 'Сотвори в мені чисте серце, Боже, і відновлений, правий дух влий у мене.',
      ru: 'Сердце чистое сотвори во мне, Боже, и дух правый обнови внутри меня.',
      en: 'Create in me a pure heart, O God, and renew a steadfast spirit within me.',
      nl: 'Schep in mij een rein hart, o God, vernieuw in mij een juiste geest.',
      es: 'Crea en mí, oh Dios, un corazón limpio, y renueva un espíritu recto dentro de mí.',
    },
    reference: { ua: 'Псалом 50:12', ru: 'Псалом 50:12', en: 'Psalm 51:10', nl: 'Psalm 51:12', es: 'Salmo 51:10' },
  },
  {
    text: {
      ua: 'Бо тисяча днів у дворах Твоїх — краща, ніж тисяча інде; вибираю стояти на порозі дому Бога мого.',
      ru: 'Ибо один день во дворах Твоих лучше тысячи. Желаю лучше быть у порога в доме Бога моего.',
      en: 'Better is one day in your courts than a thousand elsewhere; I would rather be a doorkeeper in the house of my God.',
      nl: 'Want één dag in Uw voorhoven is beter dan duizend elders; ik sta liever op de drempel van het huis van mijn God.',
      es: 'Porque mejor es un día en tus atrios que mil fuera de ellos. Escogería antes estar a la puerta de la casa de mi Dios.',
    },
    reference: { ua: 'Псалом 83:11', ru: 'Псалом 83:11', en: 'Psalm 84:10', nl: 'Psalm 84:11', es: 'Salmo 84:10' },
  },
  // --- Proverbs ---
  {
    text: {
      ua: 'Доручи Господеві справи твої, і задуми твої здійсняться.',
      ru: 'Предай Господу дела твои, и помышления твои осуществятся.',
      en: 'Commit to the Lord whatever you do, and he will establish your plans.',
      nl: 'Draag uw werken aan de HEER op en uw plannen zullen slagen.',
      es: 'Encomienda al Señor tus obras, y tus pensamientos serán afirmados.',
    },
    reference: { ua: 'Приповідки 16:3', ru: 'Притчи 16:3', en: 'Proverbs 16:3', nl: 'Spreuken 16:3', es: 'Proverbios 16:3' },
  },
  {
    text: {
      ua: 'Серце людини обдумує свій шлях, але Господь скеровує її кроки.',
      ru: 'Сердце человека обдумывает свой путь, но Господь управляет шествием его.',
      en: 'In their hearts humans plan their course, but the Lord establishes their steps.',
      nl: 'Het hart van de mens overdenkt zijn weg, maar de HEER bestiert zijn gang.',
      es: 'El corazón del hombre piensa su camino; mas el Señor endereza sus pasos.',
    },
    reference: { ua: 'Приповідки 16:9', ru: 'Притчи 16:9', en: 'Proverbs 16:9', nl: 'Spreuken 16:9', es: 'Proverbios 16:9' },
  },
  {
    text: {
      ua: 'Ім\'я Господнє — міцна вежа: праведний побіжить до неї і врятується.',
      ru: 'Имя Господа — крепкая башня: убегает в неё праведник и безопасен.',
      en: 'The name of the Lord is a fortified tower; the righteous run to it and are safe.',
      nl: 'De naam van de HEER is een sterke toren; de rechtvaardige snelt daarheen en is veilig.',
      es: 'El nombre del Señor es torre fuerte; a él corre el justo, y está a salvo.',
    },
    reference: { ua: 'Приповідки 18:10', ru: 'Притчи 18:10', en: 'Proverbs 18:10', nl: 'Spreuken 18:10', es: 'Proverbios 18:10' },
  },
  {
    text: {
      ua: 'Друг любить у всякий час і, як брат, народжується для скрутного часу.',
      ru: 'Друг любит во всякое время и, как брат, явится во время несчастья.',
      en: 'A friend loves at all times, and a brother is born for a time of adversity.',
      nl: 'Een vriend heeft te allen tijde lief, en een broeder wordt geboren voor de tijd van tegenspoed.',
      es: 'En todo tiempo ama el amigo, y es como un hermano en tiempo de angustia.',
    },
    reference: { ua: 'Приповідки 17:17', ru: 'Притчи 17:17', en: 'Proverbs 17:17', nl: 'Spreuken 17:17', es: 'Proverbios 17:17' },
  },
  {
    text: {
      ua: 'Початок мудрості — страх Господній; добрий розум у всіх, хто чинить за ним.',
      ru: 'Начало мудрости — страх Господень; разум верный у всех, исполняющих заповеди Его.',
      en: 'The fear of the Lord is the beginning of wisdom; all who follow his precepts have good understanding.',
      nl: 'Het begin van de wijsheid is de vreze des HEREN; een goed inzicht hebben allen die zijn geboden gehoorzamen.',
      es: 'El principio de la sabiduría es el temor del Señor; buen entendimiento tienen todos los que practican sus mandamientos.',
    },
    reference: { ua: 'Псалом 110:10', ru: 'Псалом 110:10', en: 'Psalm 111:10', nl: 'Psalm 111:10', es: 'Salmo 111:10' },
  },
  {
    text: {
      ua: 'Залізо залізо гострить, так і людина гострить обличчя свого ближнього.',
      ru: 'Железо железо острит, и человек острит взгляд друга своего.',
      en: 'As iron sharpens iron, so one person sharpens another.',
      nl: 'Ijzer scherpt ijzer, en de ene mens scherpt het aanzien van de andere.',
      es: 'El hierro con hierro se aguza; y así el hombre aguza el rostro de su amigo.',
    },
    reference: { ua: 'Приповідки 27:17', ru: 'Притчи 27:17', en: 'Proverbs 27:17', nl: 'Spreuken 27:17', es: 'Proverbios 27:17' },
  },
  {
    text: {
      ua: 'Не будь переможений злом, але перемагай зло добром.',
      ru: 'Не будь побеждён злом, но побеждай зло добром.',
      en: 'Do not be overcome by evil, but overcome evil with good.',
      nl: 'Word niet overwonnen door het kwade, maar overwin het kwade door het goede.',
      es: 'No seas vencido de lo malo, sino vence con el bien el mal.',
    },
    reference: { ua: 'Римлян 12:21', ru: 'Римлянам 12:21', en: 'Romans 12:21', nl: 'Romeinen 12:21', es: 'Romanos 12:21' },
  },
  {
    text: {
      ua: 'Милості Господньої — що не вичерпалися, що не скінчилося Його милосердя: воно щоранку нове.',
      ru: 'По милости Господа мы не исчезли, ибо милосердие Его не истощается. Оно обновляется каждое утро.',
      en: 'Because of the Lord\'s great love we are not consumed, for his compassions never fail. They are new every morning.',
      nl: 'Door de goedertierenheden des HEREN zijn wij niet omgekomen, want zijn barmhartigheden houden niet op; ze zijn elke morgen nieuw.',
      es: 'Por la misericordia del Señor no hemos sido consumidos, porque nunca decayeron sus misericordias. Nuevas son cada mañana.',
    },
    reference: { ua: 'Плач 3:22-23', ru: 'Плач 3:22-23', en: 'Lamentations 3:22-23', nl: 'Klaagliederen 3:22-23', es: 'Lamentaciones 3:22-23' },
  },
  {
    text: {
      ua: 'Не втомлюймося чинити добро, бо свого часу пожнемо, якщо не знесилимося.',
      ru: 'Делая добро, да не унываем, ибо в своё время пожнём, если не ослабеем.',
      en: 'Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up.',
      nl: 'Laten wij niet moedeloos worden in het goede doen, want te zijner tijd zullen wij maaien als wij niet verslappen.',
      es: 'No nos cansemos, pues, de hacer bien; porque a su tiempo segaremos, si no desmayamos.',
    },
    reference: { ua: 'Галатян 6:9', ru: 'Галатам 6:9', en: 'Galatians 6:9', nl: 'Galaten 6:9', es: 'Gálatas 6:9' },
  },
  {
    text: {
      ua: 'Адже я знаю, що ні смерть, ні життя... ніщо не зможе відлучити нас від любові Божої.',
      ru: 'Ибо я уверен, что ни смерть, ни жизнь... не может отлучить нас от любви Божией.',
      en: 'For I am convinced that neither death nor life... will be able to separate us from the love of God.',
      nl: 'Want ik ben ervan overtuigd dat noch dood noch leven... ons zal kunnen scheiden van de liefde van God.',
      es: 'Por lo cual estoy seguro de que ni la muerte, ni la vida... nos podrá separar del amor de Dios.',
    },
    reference: { ua: 'Римлян 8:38-39', ru: 'Римлянам 8:38-39', en: 'Romans 8:38-39', nl: 'Romeinen 8:38-39', es: 'Romanos 8:38-39' },
  },
];

export function getCurrentScripture(): LocalizedScripture {
  const now = new Date();
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const slot = Math.floor(now.getHours() * 2 + now.getMinutes() / 30); // 0–47
  return dailyScriptures[(dayOfYear * 48 + slot) % dailyScriptures.length];
}

export function getSecondsUntilNextSlot(): number {
  const now = new Date();
  const secondsInSlot = (now.getMinutes() % 30) * 60 + now.getSeconds();
  return 30 * 60 - secondsInSlot;
}

// Keep legacy export
export function getTodayScripture(): LocalizedScripture {
  return getCurrentScripture();
}

// Legacy export for type compatibility
export type { LocalizedScripture as ScriptureData };
