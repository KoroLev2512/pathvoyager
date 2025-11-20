import type { Metadata } from "next";
import { SiteFooter } from "@/widgets/site-footer/ui/SiteFooter";
import { SiteHeader } from "@/widgets/site-header/ui/SiteHeader";
import { HeroSection } from "@/widgets/hero/ui/HeroSection";
import { PopularPostsSection } from "@/widgets/popular-posts/ui/PopularPostsSection";
import { RecentPostsSection } from "@/widgets/recent-posts/ui/RecentPostsSection";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Discover hidden gems and expert travel tips from around the globe. Explore popular and recent travel articles covering digital nomad life, adventure travel, budget trips, and cultural immersion.",
  openGraph: {
    title: "PathVoyager — Your Ultimate Travel Guide",
    description:
      "Discover hidden gems and expert travel tips from around the globe. Explore popular and recent travel articles.",
    url: "https://pathvoyager.com",
    images: [
      {
        url: "/images/hero_bg.webp",
        width: 1200,
        height: 630,
        alt: "PathVoyager Travel Guide",
      },
    ],
  },
  alternates: {
    canonical: "https://pathvoyager.com",
  },
};

export default function Home() {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "PathVoyager",
    url: "https://pathvoyager.com",
    logo: "https://pathvoyager.com/images/hero_bg.webp",
    description:
      "Your ultimate travel guide with expert tips, itineraries, and travel stories from around the globe.",
    sameAs: [
      // Добавьте ссылки на социальные сети здесь
      // "https://twitter.com/pathvoyager",
      // "https://facebook.com/pathvoyager",
      // "https://instagram.com/pathvoyager",
    ],
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "PathVoyager",
    url: "https://pathvoyager.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://pathvoyager.com/travel?search={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <div className="flex-1">
        <SiteHeader />
        <main>
          <HeroSection />
          <PopularPostsSection />
          <RecentPostsSection />
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
