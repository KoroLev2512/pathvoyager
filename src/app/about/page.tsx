import Image from "next/image";
import { SiteFooter } from "@/widgets/site-footer/ui/SiteFooter";
import { SiteHeader } from "@/widgets/site-header/ui/SiteHeader";
import { AboutBanner } from "@/widgets/about-banner/ui/AboutBanner";
import { RecentPostsSection } from "@/widgets/recent-posts/ui/RecentPostsSection";
import { PromoBanner } from "@/shared/ui/PromoBanner";
import { aboutPageAuthors } from "@/shared/mocks/authors";

const AuthorCard = ({
  author,
}: {
  author: (typeof aboutPageAuthors)[0];
}) => {
  return (
    <div className="flex flex-col gap-5 md:gap-10">
      <div className="flex items-center gap-5 md:gap-10">
        <div className="relative h-[100px] w-[100px] shrink-0 overflow-hidden rounded-full">
          <Image
            src={author.avatar}
            fill
            sizes="100px"
            className="object-cover object-center"
            alt={author.name}
          />
        </div>
        <div className="flex flex-1 flex-col gap-[10px] justify-center">
          <h3 className="font-playfair text-xl md:text-2xl font-normal leading-[100%] text-[#333333]">
            {author.name}
          </h3>
          {author.quote && (
            <p className="font-open-sans text-base leading-[1.4] text-[#333333]">
              {author.quote}
            </p>
          )}
        </div>
      </div>
      {author.bio && (
        <p className="font-open-sans text-sm md:text-base font-normal leading-[1.4] text-[#333333]">
          {author.bio}
        </p>
      )}
    </div>
  );
};

export default function About() {
  return (
    <div className="flex min-h-screen w-full flex-col items-start bg-white">
      <SiteHeader />
      <AboutBanner />

      <div className="w-full bg-white">
        <div className="mx-auto flex w-full max-w-[1160px] flex-col gap-[40px] px-4 py-10 max-[400px]:max-w-[340px] max-[400px]:gap-[60px] max-[400px]:px-[10px]">
          {/* Our authors section with image */}
          <div className="flex flex-col-reverse gap-10 md:flex-row md:items-center md:gap-[100px]">
            <h2 className="font-playfair text-2xl font-normal leading-[100%] text-[#333333] md:text-[32px] md:flex-1">
              Our authors
            </h2>
            <div className="relative h-[227px] w-full overflow-hidden bg-[#767676] md:h-[380px] md:w-[570px] md:shrink-0">
              <Image
                src="/images/hero_bg.webp"
                fill
                sizes="(min-width: 768px) 570px, 340px"
                className="object-cover object-center"
                alt="Our authors"
              />
            </div>
          </div>

          <div className="flex flex-col gap-[40px]">
            {/* First author */}
            <div className="flex justify-center">
              <div className="w-full mr-auto max-w-[760px] max-[400px]:max-w-[340px]">
                <AuthorCard author={aboutPageAuthors[0]} />
              </div>
            </div>

            {/* Banner Mobile 320x100 */}
            <div className="md:hidden">
              <div className="mx-auto w-full max-w-[340px]">
                <PromoBanner
                  title="[AdSense Big Adaptive • Mobile 320x100 • Banner #2]"
                  width={340}
                  height={100}
                />
              </div>
            </div>

            {/* Banner 728x90 Desktop */}
            <div className="hidden md:block">
              <PromoBanner
                title="[AdSense Adaptive • Desktop (728x90) • Banner #1]"
                width={1160}
                height={90}
              />
            </div>

            {/* Second author */}
            <div className="flex justify-center">
              <div className="w-full mr-auto max-w-[760px] max-[400px]:max-w-[340px]">
                <AuthorCard author={aboutPageAuthors[1]} />
              </div>
            </div>

            {/* Third and fourth authors with sidebar banner */}
            <div className="flex flex-col gap-10 md:flex-row md:items-start md:gap-5">
              <div className="flex flex-1 flex-col gap-10">
                <div className="w-full max-[400px]:max-w-[340px] md:max-w-none">
                  <AuthorCard author={aboutPageAuthors[2]} />
                </div>
                <div className="w-full max-[400px]:max-w-[340px] md:max-w-none">
                  <AuthorCard author={aboutPageAuthors[3]} />
                </div>
              </div>
              <div className="hidden md:block md:ml-5 md:shrink-0">
                <PromoBanner
                  title="[(300x600) • Banner]"
                  variant="vertical"
                  width={300}
                  height={600}
                />
              </div>
            </div>

            {/* Banner 300x250 Mobile - centered */}
            <div className="mx-auto w-[300px] md:hidden">
              <PromoBanner
                title="[AdSense Rectangle • Desktop 300x250 • Banner #2]"
                variant="vertical"
                width={300}
                height={250}
              />
            </div>
          </div>
        </div>
      </div>

      <RecentPostsSection />
      <SiteFooter />
    </div>
  );
}

