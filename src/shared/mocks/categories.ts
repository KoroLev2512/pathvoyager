import type { Category } from "@/entities/category/model/types";

/**
 * Extended category data for Categories page
 * Based on Figma design: https://www.figma.com/design/YAX53pN6o6rknq7Wrb99Wk/Work?node-id=2536-12392&m=dev
 */
export const categoriesWithDetails: Array<
  Category & {
    description: string;
    features: string[];
  }
> = [
  {
    id: "adventure-outdoor",
    title: "Adventure & Outdoor",
    image: "/categories/categories-1.webp",
    color: "#ff8d28",
    description:
      "For those who hear the call of the wild. This is your guide to the world's most epic landscapes and heart-pounding experiences. We go beyond the trailhead to bring you authoritative guides on remote treks, secret climbing spots, and responsible ways to explore the planet's raw, untamed beauty. Pack your grit and curiosity—adventure awaits.",
    features: [
      "Off-the-grid hiking and trekking guides",
      "In-depth gear reviews and packing lists",
      "Safety and preparedness tips for remote travel",
      "Sustainable and leave-no-trace principles",
      "Stories from the world's last great wildernesses",
    ],
  },
  {
    id: "budget-travel",
    title: "Budget Travel",
    image: "/categories/categories-2.webp",
    color: "#114b5f",
    description:
      "Travel more, spend less, live richly. This category is your masterclass in unlocking authentic experiences without draining your savings. We cut through the fluff to deliver proven strategies, from mastering flight deals and cheap eats to finding hidden, affordable gems that don't sacrifice the magic. Because the best memories don't have to come with a luxury price tag.",
    features: [
      "Proven hacks for flights, accommodation, and transportation",
      "Destination guides focused on value and local living",
      "How to avoid tourist traps and scams",
      "Strategies for long-term travel on a shoestring budget",
      "Real stories from travelers who make every dollar count",
    ],
  },
  {
    id: "cultural-immersion",
    title: "Cultural Immersion",
    image: "/categories/categories-3.webp",
    color: "#ff383c",
    description:
      "Don't just visit—connect. Move past the photo ops and truly experience the soul of a place. Here, we explore how to engage with local traditions, savor authentic cuisine, and build genuine connections that transform a trip into a life-changing journey. It's about traveling slowly, respectfully, and with an open heart.",
    features: [
      "Guides to local festivals, rituals, and traditions",
      "Ethical homestay and community-based tourism experiences",
      "Culinary deep-dives and cooking class recommendations",
      "Tips for learning basic phrases and cultural etiquette",
      "Interviews and stories from local voices around the globe",
    ],
  },
  {
    id: "digital-nomad",
    title: "Digital Nomad",
    image: "/categories/categories-4.webp",
    color: "#0088ff",
    description:
      "Build a life of freedom, not just a vacation. This is your roadmap to successfully blending work and wanderlust. We provide practical, tested advice on everything from choosing the perfect nomad hub and managing time zones to navigating visas and building a productive routine on the road. Redefine your workplace—from a beach in Bali to a café in Lisbon.",
    features: [
      "In-depth reviews of digital nomad hotspots and co-working spaces",
      "Guides to visas, taxes, and logistics for location-independent life",
      "Tech setups and productivity tips for working from anywhere",
      "Interviews with seasoned nomads and remote work experts",
      "Balancing productivity with the temptation to explore",
    ],
  },
  {
    id: "luxury-slow-travel",
    title: "Luxury & Slow Travel",
    image: "/categories/categories-5.webp",
    color: "#1a936f",
    description:
      "Travel deeper, not just farther. This category is for those who believe true luxury is found in time, connection, and unparalleled experiences. We curate the world's most breathtaking boutique hotels, transformative wellness retreats, and immersive journeys that prioritize meaning over mileage. It's about savoring every moment and returning home truly renewed.",
    features: [
      "Curated guides to unique boutique hotels and eco-lodges",
      "Reviews of transformative wellness and spiritual retreats",
      "Slow travel itineraries that encourage deep connection",
      "The art of savoring fine dining and unique local experiences",
      "How to travel intentionally and create lasting memories",
    ],
  },
];

