import type { Author } from "@/entities/author/model/types";

/**
 * Mock data for About page authors
 * Based on Figma design: https://www.figma.com/design/YAX53pN6o6rknq7Wrb99Wk/Work?node-id=2536-12276&m=dev
 */
export const aboutPageAuthors: Author[] = [
  {
    id: "tyler-white",
    name: "Tyler White",
    role: "Digital Nomad Specialist",
    avatar: "/images/authors/author-3.webp",
    quote: '"Your office is wherever you have Wi-Fi."',
    bio: "Tyler traded his London corporate career for a lifetime of adventure. As an experienced digital nomad, he has mastered the art of working remotely from 50+ countries while exploring hidden gems off the tourist trail. He specializes in practical guides to becoming location-independent - from setting up a productive mobile office to finding the best co-working spaces with stunning views. Tyler believes work shouldn't chain you to one place, but fuel your freedom to explore the world.",
  },
  {
    id: "isabella-rossi",
    name: 'Isabella "Bella" Rossi',
    role: "Slow Travel & Culinary Expert",
    avatar: "/images/authors/author-2.webp",
    quote: '"Travel slowly. Eat deeply. Connect truly."',
    bio: 'A former food critic from Naples, Italy, Isabella believes the soul of a place is found not in its monuments, but on its plates and in its kitchen conversations. She specializes in "slow travel" and culinary immersion. Isabella doesn\'t just recommend restaurants; she forages with locals in the forests of Slovenia, learns family recipes from grandmothers in Vietnamese villages, and documents the stories behind every dish. Her writing is a rich, sensory journey for anyone who believes that to know a culture, you must first taste it.',
  },
  {
    id: "chloe-therese",
    name: "Chloe Therèse",
    role: "Cultural Anthropologist & Photographer",
    avatar: "/images/authors/author-4.webp",
    quote: '"Seek the story behind the postcard."',
    bio: "Chloe is a cultural anthropologist and photographer whose work focuses on the human element of travel. She doesn't just visit places; she immerses herself in them, spending months living in communities to understand their traditions, festivals, and daily life. Fluent in four languages, Chloe has a unique talent for building trust and capturing intimate, powerful stories. She guides our readers through vibrant local markets, ancient spiritual ceremonies, and homestay experiences, offering a profound look into the hearts of the cultures she visits.",
  },
  {
    id: "david-chen",
    name: "David Chen",
    role: "Workation & Luxury Travel Specialist",
    avatar: "/images/authors/author-1.webp",
    quote: '"Work smart, travel wide, live fully."',
    bio: "David is the master of blending career and wanderlust. He built a successful tech consultancy that allowed him to become a full-time \"workationer\" long before it was a trend. As our digital nomad and luxury travel specialist, David is the go-to expert for creating a mobile office without compromising on productivity or comfort. He tests and reviews co-working spaces, travel gear, and luxury resorts with reliable Wi-Fi. His guides are practical blueprints for designing a life of location-independent freedom, proving you don't have to choose between your career and your passion for travel.",
  },
];

