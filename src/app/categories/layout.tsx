import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories",
  description:
    "Explore travel categories: Digital Nomad, Adventure & Outdoor, Luxury & Slow Travel, Budget Travel, and Cultural Immersion. Find detailed guides and expert advice for each travel style.",
  keywords: [
    "travel categories",
    "digital nomad",
    "adventure travel",
    "luxury travel",
    "budget travel",
    "cultural immersion",
    "slow travel",
    "travel styles",
  ],
  openGraph: {
    title: "Travel Categories | PathVoyager",
    description:
      "Explore travel categories: Digital Nomad, Adventure & Outdoor, Luxury & Slow Travel, Budget Travel, and Cultural Immersion.",
    url: "https://pathvoyager.com/categories",
    images: [
      {
        url: "/images/hero_bg.webp",
        width: 1200,
        height: 630,
        alt: "PathVoyager Travel Categories",
      },
    ],
  },
  alternates: {
    canonical: "https://pathvoyager.com/categories",
  },
};

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

