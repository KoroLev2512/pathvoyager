import { SiteFooter } from "@/widgets/site-footer/ui/SiteFooter";
import { SiteHeader } from "@/widgets/site-header/ui/SiteHeader";
import { HeroSection } from "@/widgets/hero/ui/HeroSection";
import { PopularPostsSection } from "@/widgets/popular-posts/ui/PopularPostsSection";
import { RecentPostsSection } from "@/widgets/recent-posts/ui/RecentPostsSection";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col items-start bg-white">
      <SiteHeader />
      <HeroSection />
      <PopularPostsSection />
      <RecentPostsSection />
      <SiteFooter />
    </div>
  );
}
