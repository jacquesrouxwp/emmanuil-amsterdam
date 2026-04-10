import type { Lang } from '@/i18n/translations';

export interface LocalizedScripture {
  text: { ua: string; ru: string; en: string };
  reference: { ua: string; ru: string; en: string };
}

export const dailyScriptures: LocalizedScripture[] = [
  {
    text: {
      ua: 'Бо так полюбив Бог світ, що дав Сина Свого Єдинородного, щоб кожен, хто вірує в Нього, не загинув, але мав вічне життя.',
      ru: 'Ибо так возлюбил Бог мир, что отдал Сына Своего Единородного, дабы всякий, верующий в Него, не погиб, но имел жизнь вечную.',
      en: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
    },
    reference: { ua: 'Івана 3:16', ru: 'Иоанна 3:16', en: 'John 3:16' },
  },
  {
    text: {
      ua: 'Господь — Пастир мій; я ні в чому не матиму нестачі.',
      ru: 'Господь — Пастырь мой; я ни в чём не буду нуждаться.',
      en: 'The Lord is my shepherd, I lack nothing.',
    },
    reference: { ua: 'Псалом 22:1', ru: 'Псалом 22:1', en: 'Psalm 23:1' },
  },
  {
    text: {
      ua: 'Бо тільки Я знаю думки, що маю про вас, — говорить Господь, — думки миру, а не лиха, щоб дати вам майбутнє та надію.',
      ru: 'Ибо только Я знаю намерения, какие имею о вас, говорит Господь, намерения во благо, а не на зло, чтобы дать вам будущность и надежду.',
      en: 'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.',
    },
    reference: { ua: 'Єремія 29:11', ru: 'Иеремия 29:11', en: 'Jeremiah 29:11' },
  },
  {
    text: {
      ua: 'Усе можу в Тому, Хто мене зміцнює, — Ісусі Христі.',
      ru: 'Всё могу в укрепляющем меня Иисусе Христе.',
      en: 'I can do all this through him who gives me strength.',
    },
    reference: { ua: 'Филип\'ян 4:13', ru: 'Филиппийцам 4:13', en: 'Philippians 4:13' },
  },
  {
    text: {
      ua: 'Не бійся, бо Я з тобою; не озирайся, бо Я Бог твій; Я зміцню тебе і допоможу тобі.',
      ru: 'Не бойся, ибо Я с тобою; не смущайся, ибо Я Бог твой; Я укреплю тебя, и помогу тебе.',
      en: 'So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you.',
    },
    reference: { ua: 'Ісая 41:10', ru: 'Исаия 41:10', en: 'Isaiah 41:10' },
  },
  {
    text: {
      ua: 'Надійся на Господа всім серцем своїм і не покладайся на власний розум.',
      ru: 'Надейся на Господа всем сердцем твоим, и не полагайся на разум твой.',
      en: 'Trust in the Lord with all your heart and lean not on your own understanding.',
    },
    reference: { ua: 'Приповідки 3:5', ru: 'Притчи 3:5', en: 'Proverbs 3:5' },
  },
  {
    text: {
      ua: 'І мир Божий, що перевищує всяке розуміння, збереже серця ваші та думки ваші у Христі Ісусі.',
      ru: 'И мир Божий, который превыше всякого ума, соблюдёт сердца ваши и помышления ваши во Христе Иисусе.',
      en: 'And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.',
    },
    reference: { ua: 'Филип\'ян 4:7', ru: 'Филиппийцам 4:7', en: 'Philippians 4:7' },
  },
  {
    text: {
      ua: 'Та ми знаємо, що тим, хто любить Бога, хто покликаний за Його задумом, усе сприяє на добро.',
      ru: 'Притом знаем, что любящим Бога, призванным по Его изволению, всё содействует ко благу.',
      en: 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.',
    },
    reference: { ua: 'Римлян 8:28', ru: 'Римлянам 8:28', en: 'Romans 8:28' },
  },
  {
    text: {
      ua: 'Прийдіть до Мене всі, хто трудиться і обтяжений, і Я заспокою вас.',
      ru: 'Придите ко Мне, все труждающиеся и обременённые, и Я успокою вас.',
      en: 'Come to me, all you who are weary and burdened, and I will give you rest.',
    },
    reference: { ua: 'Матвія 11:28', ru: 'Матфея 11:28', en: 'Matthew 11:28' },
  },
  {
    text: {
      ua: 'Ісус сказав їй: Я є воскресіння і життя; той, хто вірує в Мене, навіть якщо й помре — оживе.',
      ru: 'Иисус сказал ей: Я есмь воскресение и жизнь; верующий в Меня, если и умрёт, оживёт.',
      en: 'Jesus said to her, "I am the resurrection and the life. The one who believes in me will live, even though they die."',
    },
    reference: { ua: 'Івана 11:25', ru: 'Иоанна 11:25', en: 'John 11:25' },
  },
  {
    text: {
      ua: 'Будьте добрі один до одного, милосердні, прощайте один одному, як і Бог у Христі простив вам.',
      ru: 'Будьте друг ко другу добры, сострадательны, прощайте друг друга, как и Бог во Христе простил вас.',
      en: 'Be kind and compassionate to one another, forgiving each other, just as in Christ God forgave you.',
    },
    reference: { ua: 'Єфесян 4:32', ru: 'Ефесянам 4:32', en: 'Ephesians 4:32' },
  },
  {
    text: {
      ua: 'Віра ж — це здійснення очікуваного і впевненість у невидимому.',
      ru: 'Вера же есть осуществление ожидаемого и уверенность в невидимом.',
      en: 'Now faith is confidence in what we hope for and assurance about what we do not see.',
    },
    reference: { ua: 'Євреїв 11:1', ru: 'Евреям 11:1', en: 'Hebrews 11:1' },
  },
  {
    text: {
      ua: 'Бог є любов, і той, хто перебуває в любові, перебуває в Богові, і Бог — у ньому.',
      ru: 'Бог есть любовь, и пребывающий в любви пребывает в Боге, и Бог в нём.',
      en: 'God is love. Whoever lives in love lives in God, and God in them.',
    },
    reference: { ua: 'Перше Івана 4:16', ru: 'Первое Иоанна 4:16', en: '1 John 4:16' },
  },
  {
    text: {
      ua: 'Бо ви спасені благодаттю через віру, і це не від вас — Божий дар.',
      ru: 'Ибо вы спасены по благодати через веру, и это не от вас, Божий дар.',
      en: 'For it is by grace you have been saved, through faith — and this is not from yourselves, it is the gift of God.',
    },
    reference: { ua: 'Єфесян 2:8', ru: 'Ефесянам 2:8', en: 'Ephesians 2:8' },
  },
  {
    text: {
      ua: 'Радійте завжди в Господі; знову кажу: радійте.',
      ru: 'Радуйтесь всегда в Господе; и ещё говорю: радуйтесь.',
      en: 'Rejoice in the Lord always. I will say it again: Rejoice!',
    },
    reference: { ua: 'Филип\'ян 4:4', ru: 'Филиппийцам 4:4', en: 'Philippians 4:4' },
  },
  {
    text: {
      ua: 'Господь — світло моє і спасіння моє: кого мені боятися?',
      ru: 'Господь — свет мой и спасение моё: кого мне бояться?',
      en: 'The Lord is my light and my salvation — whom shall I fear?',
    },
    reference: { ua: 'Псалом 26:1', ru: 'Псалом 26:1', en: 'Psalm 27:1' },
  },
  {
    text: {
      ua: 'Бо Я Господь, Бог твій, що тримаю тебе за правицю твою, кажу тобі: не бійся, Я допомагаю тобі.',
      ru: 'Ибо Я Господь, Бог твой; держу тебя за правую руку твою, говорю тебе: не бойся, Я помогаю тебе.',
      en: 'For I am the Lord your God who takes hold of your right hand and says to you, Do not fear; I will help you.',
    },
    reference: { ua: 'Ісая 41:13', ru: 'Исаия 41:13', en: 'Isaiah 41:13' },
  },
  {
    text: {
      ua: 'Як лань прагне до потоків водних, так прагне душа моя до Тебе, Боже.',
      ru: 'Как лань желает к потокам воды, так желает душа моя к Тебе, Боже.',
      en: 'As the deer pants for streams of water, so my soul pants for you, my God.',
    },
    reference: { ua: 'Псалом 41:2', ru: 'Псалом 41:2', en: 'Psalm 42:1' },
  },
  {
    text: {
      ua: 'Благословлятиму Господа повсякчас; хвала Йому завжди у вустах моїх.',
      ru: 'Благословлю Господа во всякое время; хвала Ему непрестанно в устах моих.',
      en: 'I will extol the Lord at all times; his praise will always be on my lips.',
    },
    reference: { ua: 'Псалом 33:2', ru: 'Псалом 33:2', en: 'Psalm 34:1' },
  },
  {
    text: {
      ua: 'Якщо Бог за нас, то хто проти нас?',
      ru: 'Если Бог за нас, кто против нас?',
      en: 'If God is for us, who can be against us?',
    },
    reference: { ua: 'Римлян 8:31', ru: 'Римлянам 8:31', en: 'Romans 8:31' },
  },
  {
    text: {
      ua: 'Але ті, що надіються на Господа, оновляться в силі; піднімуть крила, як орли.',
      ru: 'Но те, кто надеется на Господа, обновятся в силе; поднимут крылья, как орлы.',
      en: 'But those who hope in the Lord will renew their strength. They will soar on wings like eagles.',
    },
    reference: { ua: 'Ісая 40:31', ru: 'Исаия 40:31', en: 'Isaiah 40:31' },
  },
  {
    text: {
      ua: 'Любов довготерпить, милосердиться, любов не заздрить, не чваниться, не надимається.',
      ru: 'Любовь долготерпит, милосердствует, любовь не завидует, не превозносится, не гордится.',
      en: 'Love is patient, love is kind. It does not envy, it does not boast, it is not proud.',
    },
    reference: { ua: 'Перше Коринтян 13:4', ru: 'Первое Коринфянам 13:4', en: '1 Corinthians 13:4' },
  },
  {
    text: {
      ua: 'Повір у Господа Ісуса Христа, і спасешся ти і дім твій.',
      ru: 'Веруйте в Господа Иисуса Христа, и спасётесь вы и весь дом ваш.',
      en: 'Believe in the Lord Jesus, and you will be saved — you and your household.',
    },
    reference: { ua: 'Дії 16:31', ru: 'Деяния 16:31', en: 'Acts 16:31' },
  },
  {
    text: {
      ua: 'Слово Твоє — світильник для ніг моїх і світло для стежки моєї.',
      ru: 'Слово Твоё — светильник ноге моей и свет стезе моей.',
      en: 'Your word is a lamp for my feet, a light on my path.',
    },
    reference: { ua: 'Псалом 118:105', ru: 'Псалом 118:105', en: 'Psalm 119:105' },
  },
  {
    text: {
      ua: 'Бо де двоє чи троє зібрані в ім\'я Моє, там Я серед них.',
      ru: 'Ибо где двое или трое собраны во имя Моё, там Я посреди них.',
      en: 'For where two or three gather in my name, there am I with them.',
    },
    reference: { ua: 'Матвія 18:20', ru: 'Матфея 18:20', en: 'Matthew 18:20' },
  },
  {
    text: {
      ua: 'Пам\'ятай, що Я наказав тобі: будь твердий і мужній, не бійся і не лякайся.',
      ru: 'Помни, что Я повелел тебе: будь твёрд и мужествен, не бойся и не ужасайся.',
      en: 'Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged.',
    },
    reference: { ua: 'Ісус Навин 1:9', ru: 'Иисус Навин 1:9', en: 'Joshua 1:9' },
  },
  {
    text: {
      ua: 'Ісус Христос учора і сьогодні — той самий і навіки.',
      ru: 'Иисус Христос вчера и сегодня и вовеки Тот же.',
      en: 'Jesus Christ is the same yesterday and today and forever.',
    },
    reference: { ua: 'Євреїв 13:8', ru: 'Евреям 13:8', en: 'Hebrews 13:8' },
  },
  {
    text: {
      ua: 'Близький Господь до всіх, хто кличе Його, до всіх, хто кличе Його в правді.',
      ru: 'Близок Господь ко всем призывающим Его, ко всем призывающим Его в истине.',
      en: 'The Lord is near to all who call on him, to all who call on him in truth.',
    },
    reference: { ua: 'Псалом 144:18', ru: 'Псалом 144:18', en: 'Psalm 145:18' },
  },
  {
    text: {
      ua: 'Він дає силу стомленому і виснаженому дарує міцність.',
      ru: 'Он даёт утомлённому силу и изнемогшему дарует крепость.',
      en: 'He gives strength to the weary and increases the power of the weak.',
    },
    reference: { ua: 'Ісая 40:29', ru: 'Исаия 40:29', en: 'Isaiah 40:29' },
  },
  {
    text: {
      ua: 'Нехай благословить тебе Господь і збереже тебе! Нехай осяє тебе Господь лицем Своїм і помилує тебе!',
      ru: 'Да благословит тебя Господь и сохранит тебя! Да призрит на тебя Господь светлым лицом Своим и помилует тебя!',
      en: 'The Lord bless you and keep you; the Lord make his face shine on you and be gracious to you.',
    },
    reference: { ua: 'Числа 6:24-25', ru: 'Числа 6:24-25', en: 'Numbers 6:24-25' },
  },
  {
    text: {
      ua: 'Шукайте ж перш за все Царства Божого і правди Його, а все це додасться вам.',
      ru: 'Ищите прежде Царства Божия и правды Его, и это всё приложится вам.',
      en: 'But seek first his kingdom and his righteousness, and all these things will be given to you as well.',
    },
    reference: { ua: 'Матвія 6:33', ru: 'Матфея 6:33', en: 'Matthew 6:33' },
  },
  // --- Psalms ---
  {
    text: {
      ua: 'Заспокойтеся і знайте, що Я — Бог; Я піднесений між народами, піднесений на землі.',
      ru: 'Остановитесь и познайте, что Я — Бог; Я буду превознесён в народах, превознесён на земле.',
      en: 'Be still, and know that I am God; I will be exalted among the nations, I will be exalted in the earth.',
    },
    reference: { ua: 'Псалом 45:11', ru: 'Псалом 45:11', en: 'Psalm 46:10' },
  },
  {
    text: {
      ua: 'Господь — сила моя і щит мій; на Нього надіялося серце моє, і Він допоміг мені.',
      ru: 'Господь — крепость моя и щит мой; на Него уповало сердце моё, и Он помог мне.',
      en: 'The Lord is my strength and my shield; my heart trusts in him, and he helps me.',
    },
    reference: { ua: 'Псалом 27:7', ru: 'Псалом 27:7', en: 'Psalm 28:7' },
  },
  {
    text: {
      ua: 'Звідки прийде мені допомога? Допомога моя від Господа, що сотворив небо і землю.',
      ru: 'Откуда придёт помощь моя? Помощь моя от Господа, сотворившего небо и землю.',
      en: 'Where does my help come from? My help comes from the Lord, the Maker of heaven and earth.',
    },
    reference: { ua: 'Псалом 120:1-2', ru: 'Псалом 120:1-2', en: 'Psalm 121:1-2' },
  },
  {
    text: {
      ua: 'Радуйся Господеві і Він виконає бажання серця твого. Довір Господеві путь свій, надійся на Нього.',
      ru: 'Утешайся Господом, и Он исполнит желания сердца твоего. Предай Господу путь твой и уповай на Него.',
      en: 'Delight yourself in the Lord, and he will give you the desires of your heart. Commit your way to the Lord; trust in him.',
    },
    reference: { ua: 'Псалом 36:4-5', ru: 'Псалом 36:4-5', en: 'Psalm 37:4-5' },
  },
  {
    text: {
      ua: 'Я прославлю Тебе, бо дивно я створений; дивні діла Твої, і душа моя це добре знає.',
      ru: 'Славлю Тебя, потому что я дивно устроен; дивны дела Твои, и душа моя вполне сознаёт это.',
      en: 'I praise you because I am fearfully and wonderfully made; your works are wonderful, I know that full well.',
    },
    reference: { ua: 'Псалом 138:14', ru: 'Псалом 138:14', en: 'Psalm 139:14' },
  },
  {
    text: {
      ua: 'Господь — моя скеля і фортеця моя і визволитель мій; Бог мій — твердиня моя, на Нього надіюся.',
      ru: 'Господь — твердыня моя и крепость моя и избавитель мой, Бог мой — скала моя; на Него я уповаю.',
      en: 'The Lord is my rock, my fortress and my deliverer; my God is my rock, in whom I take refuge.',
    },
    reference: { ua: 'Псалом 17:3', ru: 'Псалом 17:3', en: 'Psalm 18:2' },
  },
  {
    text: {
      ua: 'Хваліте Господа, бо Він добрий, бо навіки милість Його.',
      ru: 'Славьте Господа, ибо Он благ, ибо вовек милость Его.',
      en: 'Give thanks to the Lord, for he is good; his love endures forever.',
    },
    reference: { ua: 'Псалом 106:1', ru: 'Псалом 106:1', en: 'Psalm 107:1' },
  },
  {
    text: {
      ua: 'Хай знайде відраду в Господі сумний; нехай покоряться Йому всі народи землі.',
      ru: 'Ибо Он насытил душу жаждущую и душу алчущую исполнил благами.',
      en: 'He satisfies the thirsty and fills the hungry with good things.',
    },
    reference: { ua: 'Псалом 106:9', ru: 'Псалом 106:9', en: 'Psalm 107:9' },
  },
  {
    text: {
      ua: 'Сотвори в мені чисте серце, Боже, і відновлений, правий дух влий у мене.',
      ru: 'Сердце чистое сотвори во мне, Боже, и дух правый обнови внутри меня.',
      en: 'Create in me a pure heart, O God, and renew a steadfast spirit within me.',
    },
    reference: { ua: 'Псалом 50:12', ru: 'Псалом 50:12', en: 'Psalm 51:10' },
  },
  {
    text: {
      ua: 'Бо тисяча днів у дворах Твоїх — краща, ніж тисяча інде; вибираю стояти на порозі дому Бога мого.',
      ru: 'Ибо один день во дворах Твоих лучше тысячи. Желаю лучше быть у порога в доме Бога моего.',
      en: 'Better is one day in your courts than a thousand elsewhere; I would rather be a doorkeeper in the house of my God.',
    },
    reference: { ua: 'Псалом 83:11', ru: 'Псалом 83:11', en: 'Psalm 84:10' },
  },
  // --- Proverbs ---
  {
    text: {
      ua: 'Доручи Господеві справи твої, і задуми твої здійсняться.',
      ru: 'Предай Господу дела твои, и помышления твои осуществятся.',
      en: 'Commit to the Lord whatever you do, and he will establish your plans.',
    },
    reference: { ua: 'Приповідки 16:3', ru: 'Притчи 16:3', en: 'Proverbs 16:3' },
  },
  {
    text: {
      ua: 'Серце людини обдумує свій шлях, але Господь скеровує її кроки.',
      ru: 'Сердце человека обдумывает свой путь, но Господь управляет шествием его.',
      en: 'In their hearts humans plan their course, but the Lord establishes their steps.',
    },
    reference: { ua: 'Приповідки 16:9', ru: 'Притчи 16:9', en: 'Proverbs 16:9' },
  },
  {
    text: {
      ua: 'Ім\'я Господнє — міцна вежа: праведний побіжить до неї і врятується.',
      ru: 'Имя Господа — крепкая башня: убегает в неё праведник и безопасен.',
      en: 'The name of the Lord is a fortified tower; the righteous run to it and are safe.',
    },
    reference: { ua: 'Приповідки 18:10', ru: 'Притчи 18:10', en: 'Proverbs 18:10' },
  },
  {
    text: {
      ua: 'Друг любить у всякий час і, як брат, народжується для скрутного часу.',
      ru: 'Друг любит во всякое время и, как брат, явится во время несчастья.',
      en: 'A friend loves at all times, and a brother is born for a time of adversity.',
    },
    reference: { ua: 'Приповідки 17:17', ru: 'Притчи 17:17', en: 'Proverbs 17:17' },
  },
  {
    text: {
      ua: 'Початок мудрості — страх Господній; добрий розум у всіх, хто чинить за ним.',
      ru: 'Начало мудрости — страх Господень; разум верный у всех, исполняющих заповеди Его.',
      en: 'The fear of the Lord is the beginning of wisdom; all who follow his precepts have good understanding.',
    },
    reference: { ua: 'Псалом 110:10', ru: 'Псалом 110:10', en: 'Psalm 111:10' },
  },
  {
    text: {
      ua: 'Залізо залізо гострить, так і людина гострить обличчя свого ближнього.',
      ru: 'Железо железо острит, и человек острит взгляд друга своего.',
      en: 'As iron sharpens iron, so one person sharpens another.',
    },
    reference: { ua: 'Приповідки 27:17', ru: 'Притчи 27:17', en: 'Proverbs 27:17' },
  },
  {
    text: {
      ua: 'Не будь переможений злом, але перемагай зло добром.',
      ru: 'Не будь побеждён злом, но побеждай зло добром.',
      en: 'Do not be overcome by evil, but overcome evil with good.',
    },
    reference: { ua: 'Римлян 12:21', ru: 'Римлянам 12:21', en: 'Romans 12:21' },
  },
  {
    text: {
      ua: 'Милості Господньої — що не вичерпалися, що не скінчилося Його милосердя: воно щоранку нове.',
      ru: 'По милости Господа мы не исчезли, ибо милосердие Его не истощается. Оно обновляется каждое утро.',
      en: 'Because of the Lord\'s great love we are not consumed, for his compassions never fail. They are new every morning.',
    },
    reference: { ua: 'Плач 3:22-23', ru: 'Плач 3:22-23', en: 'Lamentations 3:22-23' },
  },
  {
    text: {
      ua: 'Не втомлюймося чинити добро, бо свого часу пожнемо, якщо не знесилимося.',
      ru: 'Делая добро, да не унываем, ибо в своё время пожнём, если не ослабеем.',
      en: 'Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up.',
    },
    reference: { ua: 'Галатян 6:9', ru: 'Галатам 6:9', en: 'Galatians 6:9' },
  },
  {
    text: {
      ua: 'Адже я знаю, що ні смерть, ні життя... ніщо не зможе відлучити нас від любові Божої.',
      ru: 'Ибо я уверен, что ни смерть, ни жизнь... не может отлучить нас от любви Божией.',
      en: 'For I am convinced that neither death nor life... will be able to separate us from the love of God.',
    },
    reference: { ua: 'Римлян 8:38-39', ru: 'Римлянам 8:38-39', en: 'Romans 8:38-39' },
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
