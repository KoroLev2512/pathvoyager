import type { Post } from "@/entities/post/model/types";

export type ArticleContentBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "quote"; text: string; author?: string }
  | { type: "list"; items: string[] }
  | { type: "banner"; id: string };

export type ArticleDetail = Post & {
  coverImage?: string;
  content: ArticleContentBlock[];
};

export const articleDetailsMocks: ArticleDetail[] = [
  {
    id: "time-zone-hacking",
    title: "Time Zone Hacking",
    excerpt:
      "Practical strategies for managing client expectations and your own schedule.",
    image: "/images/popular/popular-1.webp",
    coverImage: "/images/popular/popular-1.webp",
    categoryId: "digital-nomad",
    authorId: "author-1",
    publishedAt: "2024-01-15",
    readTime: "5 min read",
    tags: ["Remote Work", "Productivity"],
    content: [
      {
        type: "paragraph",
        text: "Coordinating projects across continents doesn’t need to feel like a mathematical puzzle. Time zone hacking is about designing rituals that keep energy high while your calendar stays crystal clear.",
      },
      {
        type: "heading",
        text: "Understand Your Natural Rhythm",
      },
      {
        type: "paragraph",
        text: "Start by identifying your most productive hours. Do you hit peak focus at sunrise or late at night? Protect those blocks for deep work. Then layer shallow tasks around them so meetings never land in the middle of your flow state.",
      },
      {
        type: "list",
        items: [
          "Run a seven-day energy audit to track when you feel creative versus drained.",
          "Set recurring events in your calendar to guard those high-focus hours.",
          "Batch similar tasks together so handoffs feel seamless across time zones.",
        ],
      },
      {
        type: "heading",
        text: "Design a Transparent Calendar",
      },
      {
        type: "paragraph",
        text: "Transparency eliminates guesswork. Create a shared calendar that displays both your time zone and your client’s. Add color-coded statuses—like \"Deep Work\" or \"Flexible\"—so teammates know when to expect fast responses.",
      },
      {
        type: "quote",
        text: "The more clearly you communicate your availability, the fewer midnight pings derail your weekend.",
        author: "Tyler White",
      },
      {
        type: "paragraph",
        text: "Don’t forget buffer windows. Blocking 15 minutes before and after every call protects you from back-to-back fatigue and gives space for notes or bio breaks.",
      },
      {
        type: "heading",
        text: "Stack Your Tools",
      },
      {
        type: "paragraph",
        text: "Rely on automation to keep everyone aligned. World clock widgets, asynchronous video updates, and smart scheduling links ensure no one has to play calendar Tetris.",
      },
      {
        type: "list",
        items: [
          "Use apps like Reclaim or Motion to automatically rearrange your to-do list as meetings shift.",
          "Send weekly Loom recaps so updates land before teammates wake up.",
          "Document decisions in shared hubs—Notion, Coda, or your CRM—to eliminate status check-ins.",
        ],
      },
      {
        type: "paragraph",
        text: "By combining self-awareness, transparent communication, and the right toolkit, you can stay anchored no matter how many borders your projects cross.",
      },
      { type: "banner", id: "rectangle" },
      {
        type: "heading",
        text: "Build Sustainable Habits",
      },
      {
        type: "paragraph",
        text: "Sustainability matters. Protect your sleep schedule, schedule walking calls, and log off when the day is done. Consistency keeps your clients confident and your body aligned.",
      },
    ],
  },
  {
    id: "cold-weather-camping",
    title: "Cold Weather Camping",
    excerpt:
      "Field-tested equipment recommendations from experienced arctic travelers.",
    image: "/images/popular/popular-2.webp",
    coverImage: "/images/popular/popular-2.webp",
    categoryId: "adventure-outdoor",
    authorId: "author-2",
    publishedAt: "2024-01-12",
    readTime: "7 min read",
    tags: ["Camping", "Adventure"],
    content: [
      {
        type: "paragraph",
        text: "When temperatures fall below freezing, preparation becomes survival. Cold weather camping rewards those who obsess over layers, nutrition, and backup plans.",
      },
      {
        type: "heading",
        text: "Layer With Intention",
      },
      {
        type: "paragraph",
        text: "Your base layer manages moisture, mid-layer traps heat, and shell blocks wind. Invest in merino wool, synthetic puffers, and waterproof breathable shells. Cotton is banned—it holds water and accelerates heat loss.",
      },
      {
        type: "list",
        items: [
          "Pack at least two base layers so you can rotate a dry set for sleeping.",
          "Choose mittens over gloves if windchill falls below -10°C; they preserve more warmth.",
          "Vent your shell during climbs to prevent sweat from freezing once you stop moving.",
        ],
      },
      {
        type: "heading",
        text: "Dial In Your Shelter",
      },
      {
        type: "paragraph",
        text: "Four-season tents, insulated sleeping pads, and expedition-rated bags are non-negotiable. Pair a closed-cell foam pad with an inflatable one to prevent conductive heat loss.",
      },
      {
        type: "quote",
        text: "If your sleeping bag isn’t warm enough, nothing else matters.",
        author: "Isabella Rossi",
      },
      {
        type: "paragraph",
        text: "Shake snow off the tent before crawling in, keep a dry pair of socks just for sleeping, and store batteries in your inner pockets so they don’t drain overnight.",
      },
      {
        type: "heading",
        text: "Fuel the Fire",
      },
      {
        type: "paragraph",
        text: "High-calorie meals and warm drinks keep your metabolism roaring. Pack dehydrated stews, nut butters, and a reliable stove with winter fuel.",
      },
      {
        type: "list",
        items: [
          "Eat a hot meal before bed to generate long-lasting warmth.",
          "Carry an insulated bottle and store it upside down so the lid doesn’t freeze shut.",
          "Pre-pack snacks in easy-access pockets; gloves make packaging impossible.",
        ],
      },
      {
        type: "paragraph",
        text: "With the right kit and mindset, winter camps transform into sparkling, silent retreats. Cold is a challenge—but also the secret to seeing popular sites without crowds.",
      },
    ],
  },
];
