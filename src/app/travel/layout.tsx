import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Travel Blog",
  description:
    "Browse all travel articles by category. Discover expert guides on digital nomad life, adventure travel, budget trips, luxury travel, and cultural immersion from experienced travelers.",
  keywords: [
    "travel blog",
    "travel articles",
    "travel guides",
    "travel stories",
    "travel tips",
    "digital nomad",
    "adventure travel",
    "budget travel",
  ],
  openGraph: {
    title: "Travel Blog | PathVoyager",
    description:
      "Browse all travel articles by category. Discover expert guides on digital nomad life, adventure travel, and more.",
    url: "https://pathvoyager.com/travel",
    images: [
      {
        url: "/images/hero_bg.webp",
        width: 1200,
        height: 630,
        alt: "PathVoyager Travel Blog",
      },
    ],
  },
  alternates: {
    canonical: "https://pathvoyager.com/travel",
  },
};

export default function TravelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

