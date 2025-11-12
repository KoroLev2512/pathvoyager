import type { Post } from "./types";

export const heroPost: Post = {
  id: "aurora-hunt",
  title: "За северным сиянием в Исландию: маршрут на неделю",
  excerpt:
    "Как спланировать путешествие, чтобы поймать северное сияние, где жить и какие локации посещать каждый день.",
  image: "/images/hero_bg.webp",
  categoryId: "nature",
  authorId: "elena-sazonova",
  publishedAt: "12 ноября 2024",
  readTime: "8 минут",
  tags: ["Исландия", "Road Trip", "Зима"],
};

export const popularPosts: Post[] = [
  {
    id: "tokyo-minimalism",
    title: "Минимализм Токио: районы, кофе и архитектура",
    excerpt:
      "Современные кварталы и независимые пространства, где пропускаешь мегаполис через собственный фильтр.",
    image: "/images/popular/popular-1.webp",
    categoryId: "cities",
    authorId: "maxim-orlov",
    publishedAt: "05 ноября 2024",
    readTime: "6 минут",
    tags: ["Япония", "Город"],
  },
  {
    id: "amalfi-coastline",
    title: "Побережье Амальфи вне сезона: тихий маршрут",
    excerpt:
      "Фьорды, лимоны и балконы без толп туристов — продуманная программа на пять дней.",
    image: "/images/popular/popular-2.webp",
    categoryId: "culture",
    authorId: "vika-romanova",
    publishedAt: "28 октября 2024",
    readTime: "7 минут",
    tags: ["Италия", "Средиземноморье"],
  },
  {
    id: "georgia-wine",
    title: "Винные маршруты Грузии: регионы и традиции",
    excerpt:
      "Саперави, квеври и гостеприимство в винодельнях, где встречают как родных.",
    image: "/images/popular/popular-3.webp",
    categoryId: "culture",
    authorId: "daniil-levin",
    publishedAt: "21 октября 2024",
    readTime: "9 минут",
    tags: ["Грузия", "Вино"],
  },
  {
    id: "norway-fjords",
    title: "Норвежские фьорды на электромобиле",
    excerpt:
      "Маршрут с зарядными станциями, панорамными видами и лучшими местами для треккинга.",
    image: "/images/popular/popular-4.webp",
    categoryId: "nature",
    authorId: "elena-sazonova",
    publishedAt: "14 октября 2024",
    readTime: "10 минут",
    tags: ["Норвегия", "Road Trip"],
  },
  {
    id: "lisbon-sunsets",
    title: "Лиссабон: закаты, крыши и лоджи",
    excerpt:
      "Гид по смотровым площадкам и маршрутам, где солнце встречают особенным образом.",
    image: "/images/popular/popular-5.webp",
    categoryId: "cities",
    authorId: "maxim-orlov",
    publishedAt: "07 октября 2024",
    readTime: "5 минут",
    tags: ["Португалия", "Закаты"],
  },
  {
    id: "bali-retreat",
    title: "Йога-ретрит на Бали: баланс и море",
    excerpt:
      "Выбор виллы, занятия у океана и лучшие кафе Убуда для восстановления сил.",
    image: "/images/popular/popular-6.webp",
    categoryId: "islands",
    authorId: "vika-romanova",
    publishedAt: "30 сентября 2024",
    readTime: "6 минут",
    tags: ["Индонезия", "Ретрит"],
  },
  {
    id: "alps-weekend",
    title: "Уикенд в Альпах: коротко, но ярко",
    excerpt:
      "Как совместить панорамные тропы, сырные рынки и спа за два дня.",
    image: "/images/popular/popular-7.webp",
    categoryId: "weekend",
    authorId: "daniil-levin",
    publishedAt: "23 сентября 2024",
    readTime: "4 минуты",
    tags: ["Швейцария", "Горы"],
  },
  {
    id: "morocco-desert",
    title: "Пустыня Сахара: ночи под звездами",
    excerpt:
      "Переезд через Аит-Бен-Хадду, кемпинг в дюнах и советы, что взять с собой.",
    image: "/images/popular/popular-8.webp",
    categoryId: "nature",
    authorId: "elena-sazonova",
    publishedAt: "16 сентября 2024",
    readTime: "8 минут",
    tags: ["Марокко", "Сафари"],
  },
];

export const recentPosts: Post[] = [
  {
    id: "autumn-copenhagen",
    title: "Осенний Копенгаген: hygge на практике",
    excerpt:
      "Маршрут по районам, где вечерние огни отражаются в каналах и пахнет корицей.",
    image: "/images/recent/recent-1.webp",
    categoryId: "cities",
    authorId: "maxim-orlov",
    publishedAt: "10 ноября 2024",
    readTime: "6 минут",
    tags: ["Дания", "Осень"],
  },
  {
    id: "altai-sunrise",
    title: "Рассветы Алтая: где встречать первый свет",
    excerpt:
      "Точки для съемки и тихие базы, которые не испортят впечатление туристами.",
    image: "/images/recent/recent-2.webp",
    categoryId: "nature",
    authorId: "elena-sazonova",
    publishedAt: "02 ноября 2024",
    readTime: "7 минут",
    tags: ["Россия", "Горы"],
  },
  {
    id: "vienna-classic",
    title: "Венская классика: музыка, кофе, модерн",
    excerpt:
      "От филармонии до кофеен с вековой историей — снова влюбляемся в Вену.",
    image: "/images/recent/recent-3.webp",
    categoryId: "culture",
    authorId: "daniil-levin",
    publishedAt: "27 октября 2024",
    readTime: "5 минут",
    tags: ["Австрия", "Музыка"],
  },
  {
    id: "weekend-riga",
    title: "Рига на выходные: арт-пространства и гастрономия",
    excerpt:
      "Карта короткого путешествия в сторону Балтики с акцентом на локальные находки.",
    image: "/images/recent/recent-4.webp",
    categoryId: "weekend",
    authorId: "vika-romanova",
    publishedAt: "19 октября 2024",
    readTime: "4 минуты",
    tags: ["Латвия", "Балтика"],
  },
  {
    id: "sicily-flavors",
    title: "Сицилия: вкусы и вулканы",
    excerpt:
      "Как совместить гастрономию, пляжи и прогулку к кратеру Этны за одну поездку.",
    image: "/images/recent/recent-5.webp",
    categoryId: "culture",
    authorId: "maxim-orlov",
    publishedAt: "12 октября 2024",
    readTime: "7 минут",
    tags: ["Италия", "Вулкан"],
  },
];


