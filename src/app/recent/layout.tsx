import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recent articles",
  description:
    "Discover the latest travel articles and stories from PathVoyager. Explore recent posts about digital nomad life, adventure travel, budget trips, and cultural immersion.",
  openGraph: {
    title: "Recent articles | PathVoyager",
    description:
      "Discover the latest travel articles and stories from PathVoyager. Explore recent posts about travel adventures.",
    url: "https://pathvoyager.com/recent",
    images: [
      {
        url: "/images/hero_bg.webp",
        width: 1200,
        height: 630,
        alt: "PathVoyager Recent Articles",
      },
    ],
  },
  alternates: {
    canonical: "https://pathvoyager.com/recent",
  },
};

export default function RecentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

