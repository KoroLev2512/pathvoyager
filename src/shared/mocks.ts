import type { Post } from "@/entities/post/model/types";

/**
 * Mock data for Popular articles section
 * Based on Figma design: https://www.figma.com/design/YAX53pN6o6rknq7Wrb99Wk/Work?node-id=2536-12063&m=dev
 */
export const popularArticlesMocks: Post[] = [
  {
    id: "time-zone-hacking",
    title: "Time Zone Hacking",
    excerpt:
      "Practical strategies for managing client expectations and your own schedule.",
    image: "/images/popular/popular-1.webp",
    categoryId: "digital-nomad",
    authorId: "author-1",
    publishedAt: "2024-01-15",
    readTime: "5 min read",
    tags: ["Remote Work", "Productivity"],
  },
  {
    id: "cold-weather-camping",
    title: "Cold Weather Camping",
    excerpt:
      "Field-tested equipment recommendations from experienced arctic travelers.",
    image: "/images/popular/popular-2.webp",
    categoryId: "adventure-outdoor",
    authorId: "author-2",
    publishedAt: "2024-01-12",
    readTime: "7 min read",
    tags: ["Camping", "Adventure"],
  },
  {
    id: "art-of-slow-travel",
    title: "The Art of Slow Travel",
    excerpt:
      "Discover how to deeply connect with destinations while avoiding burnout from constant moving.",
    image: "/images/popular/popular-3.webp",
    categoryId: "luxury-slow-travel",
    authorId: "author-3",
    publishedAt: "2024-01-10",
    readTime: "6 min read",
    tags: ["Slow Travel", "Mindfulness"],
  },
  {
    id: "hostel-hacks",
    title: "Hostel Hacks Nobody Tells You",
    excerpt:
      "From securing the best bed to staying safe - essential tips for first-time hostel guests.",
    image: "/images/popular/popular-4.webp",
    categoryId: "budget-travel",
    authorId: "author-4",
    publishedAt: "2024-01-08",
    readTime: "4 min read",
    tags: ["Budget", "Hostels"],
  },
  {
    id: "private-villa-rentals",
    title: "Private Villa Rentals",
    excerpt:
      "Essential checklist for renting luxury villas abroad - from hidden fees to staff management.",
    image: "/images/popular/popular-5.webp",
    categoryId: "luxury-slow-travel",
    authorId: "author-1",
    publishedAt: "2024-01-05",
    readTime: "8 min read",
    tags: ["Luxury", "Accommodation"],
  },
  {
    id: "workation-packing-list",
    title: "Workation Packing List",
    excerpt:
      "Minimalist setup for productive remote work while traveling light.",
    image: "/images/popular/popular-6.webp",
    categoryId: "digital-nomad",
    authorId: "author-2",
    publishedAt: "2024-01-03",
    readTime: "5 min read",
    tags: ["Digital Nomad", "Packing"],
  },
  {
    id: "southeast-asia-25-day",
    title: "Southeast Asia on $25 a Day",
    excerpt:
      "Complete 2-month itinerary covering Thailand, Vietnam, and Cambodia. Learn how to stretch your budget.",
    image: "/images/popular/popular-7.webp",
    categoryId: "budget-travel",
    authorId: "author-3",
    publishedAt: "2024-01-01",
    readTime: "10 min read",
    tags: ["Budget", "Southeast Asia"],
  },
  {
    id: "building-connections-locals",
    title: "Building Genuine Connections with Locals",
    excerpt:
      "Practical ways to meet residents and experience authentic culture beyond the main attractions.",
    image: "/images/popular/popular-8.webp",
    categoryId: "cultural-immersion",
    authorId: "author-4",
    publishedAt: "2023-12-28",
    readTime: "6 min read",
    tags: ["Culture", "Local Experience"],
  },
];

/**
 * Mock data for Recent articles section
 * Based on Figma design: https://www.figma.com/design/YAX53pN6o6rknq7Wrb99Wk/Work?node-id=2536-12084&m=dev
 */
export const recentArticlesMocks: Post[] = [
  {
    id: "24-hour-stopover",
    title: "The 24-Hour Stopover",
    excerpt:
      "Our guide reveals airport storage tricks, free transit tours, and must-see sights accessible from major airports worldwide.",
    image: "/images/recent/recent-1.webp",
    categoryId: "budget-travel",
    authorId: "author-1",
    publishedAt: "2024-01-20",
    readTime: "5 min read",
    tags: ["Stopover", "Airports"],
  },
  {
    id: "beyond-souvenirs",
    title: "Beyond Souvenirs",
    excerpt:
      "Discover alternative ways to remember your journeys through cooking classes, language phrases, local art experiences, and connection-based travel.",
    image: "/images/recent/recent-2.webp",
    categoryId: "cultural-immersion",
    authorId: "author-2",
    publishedAt: "2024-01-18",
    readTime: "7 min read",
    tags: ["Culture", "Memories"],
  },
  {
    id: "nomad-health-crisis",
    title: "The Nomad Health Crisis",
    excerpt:
      "Comprehensive guide to international health insurance, local healthcare systems, and emergency planning for location-independent workers.",
    image: "/images/recent/recent-3.webp",
    categoryId: "digital-nomad",
    authorId: "author-3",
    publishedAt: "2024-01-16",
    readTime: "9 min read",
    tags: ["Health", "Insurance"],
  },
  {
    id: "beyond-the-tent",
    title: "Beyond the Tent",
    excerpt:
      "Sleep in a treehouse, cave hotel, or wilderness capsule. Discover the world's most extraordinary places.",
    image: "/images/recent/recent-4.webp",
    categoryId: "adventure-outdoor",
    authorId: "author-4",
    publishedAt: "2024-01-14",
    readTime: "6 min read",
    tags: ["Unique Stays", "Adventure"],
  },
  {
    id: "slow-safari",
    title: "Slow Safari",
    excerpt:
      "Learn how extended stays reveal animal behaviors and ecosystems that quick tourists never witness.",
    image: "/images/recent/recent-5.webp",
    categoryId: "luxury-slow-travel",
    authorId: "author-1",
    publishedAt: "2024-01-12",
    readTime: "8 min read",
    tags: ["Safari", "Wildlife"],
  },
];

