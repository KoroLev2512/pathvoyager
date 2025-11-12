import Image from "next/image";
import { SiteFooter } from "@/widgets/site-footer/ui/SiteFooter";
import { SiteHeader } from "@/widgets/site-header/ui/SiteHeader";
import { CategoriesBanner } from "@/widgets/categories-banner/ui/CategoriesBanner";
import { CategoryDetail } from "@/widgets/category-detail/ui/CategoryDetail";
import { RecentPostsSection } from "@/widgets/recent-posts/ui/RecentPostsSection";
import { PromoBanner } from "@/shared/ui/PromoBanner";
import { categoriesWithDetails } from "@/shared/mocks/categories";

export default function Categories() {
  return (
    <div className="flex min-h-screen w-full flex-col items-start bg-white">
      <SiteHeader />
      <CategoriesBanner />
      <div className="relative w-full bg-white">
        <div className="mx-auto flex w-full max-w-[1160px] flex-col gap-[40px] px-4 py-10 max-[400px]:max-w-[340px] max-[400px]:gap-[60px] max-[400px]:px-[10px]">
          {/* First and second categories with sidebar banner */}
          <div className="flex flex-col gap-5 max-[400px]:gap-5 lg:flex-row lg:gap-5 lg:justify-between">
            <div className="flex flex-1 flex-col gap-10 max-[400px]:gap-5">
              {/* First category */}
              <div className="flex flex-col gap-5">
                {/* First category header */}
                <div className="flex items-center gap-10 max-[400px]:gap-5">
                  <div className="relative h-[100px] w-[100px] shrink-0 overflow-hidden rounded-full">
                    <Image
                      src={categoriesWithDetails[0].image}
                      fill
                      sizes="100px"
                      className="object-cover object-center"
                      alt={categoriesWithDetails[0].title}
                    />
                  </div>
                  <h2
                    className="flex-1 font-playfair text-2xl font-normal leading-[100%] max-[400px]:text-xl"
                    style={{ color: categoriesWithDetails[0].color }}
                  >
                    {categoriesWithDetails[0].title}
                  </h2>
                </div>
                {/* First category description */}
                <CategoryDetail
                  image={categoriesWithDetails[0].image}
                  title={categoriesWithDetails[0].title}
                  color={categoriesWithDetails[0].color}
                  description={categoriesWithDetails[0].description}
                  features={categoriesWithDetails[0].features}
                  showHeader={false}
                />
              </div>

              {/* Banner 300x250 Mobile after first category */}
              <div className="mx-auto w-[300px] lg:hidden">
                <PromoBanner
                  title="[AdSense Rectangle • Desktop 300x250 • Banner #2]"
                  variant="vertical"
                  width={300}
                  height={250}
                />
              </div>

              {/* Second category header only */}
              <div className="flex items-center gap-10 max-[400px]:gap-5">
                <div className="relative h-[100px] w-[100px] shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={categoriesWithDetails[1].image}
                    fill
                    sizes="100px"
                    className="object-cover object-center"
                    alt={categoriesWithDetails[1].title}
                  />
                </div>
                <h2
                  className="flex-1 font-playfair text-2xl font-normal leading-[100%] max-[400px]:text-xl"
                  style={{ color: categoriesWithDetails[1].color }}
                >
                  {categoriesWithDetails[1].title}
                </h2>
              </div>
            </div>
            {/* Banner 300x600 Desktop - sidebar */}
            <div className="hidden lg:block lg:shrink-0">
              <PromoBanner
                title="[(300x600) • Banner]"
                variant="vertical"
                width={300}
                height={600}
              />
            </div>
          </div>

          {/* Second category description */}
          <CategoryDetail
            image={categoriesWithDetails[1].image}
            title={categoriesWithDetails[1].title}
            color={categoriesWithDetails[1].color}
            description={categoriesWithDetails[1].description}
            features={categoriesWithDetails[1].features}
            showHeader={false}
          />

          {/* Third category with banner */}
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-5">
            {/* Banner 300x250 - left on desktop, after header on mobile */}
            <div className="order-2 mx-auto w-[300px] shrink-0 lg:order-1 lg:mx-0">
              <PromoBanner
                title="[AdSense Rectangle • Desktop 300x250 • Banner #2]"
                variant="vertical"
                width={300}
                height={250}
              />
            </div>
            <div className="order-1 flex flex-1 flex-col gap-10 lg:order-2 max-[400px]:gap-5">
              {/* Third category header */}
              <div className="flex items-center gap-10 max-[400px]:gap-5 lg:justify-center">
                <div className="relative h-[100px] w-[100px] shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={categoriesWithDetails[2].image}
                    fill
                    sizes="100px"
                    className="object-cover object-center"
                    alt={categoriesWithDetails[2].title}
                  />
                </div>
                <h2
                  className="flex-1 font-playfair text-2xl font-normal leading-[100%] max-[400px]:text-xl"
                  style={{ color: categoriesWithDetails[2].color }}
                >
                  {categoriesWithDetails[2].title}
                </h2>
              </div>
              {/* Third category description */}
              <CategoryDetail
                image={categoriesWithDetails[2].image}
                title={categoriesWithDetails[2].title}
                color={categoriesWithDetails[2].color}
                description={categoriesWithDetails[2].description}
                features={categoriesWithDetails[2].features}
                showHeader={false}
              />
            </div>
          </div>

          {/* Fourth category */}
          <div className="flex items-center gap-10 max-[400px]:gap-5">
            <div className="relative h-[100px] w-[100px] shrink-0 overflow-hidden rounded-full">
              <Image
                src={categoriesWithDetails[3].image}
                fill
                sizes="100px"
                className="object-cover object-center"
                alt={categoriesWithDetails[3].title}
              />
            </div>
            <h2
              className="flex-1 font-playfair text-2xl font-normal leading-[100%] max-[400px]:text-xl"
              style={{ color: categoriesWithDetails[3].color }}
            >
              {categoriesWithDetails[3].title}
            </h2>
          </div>

          {/* Fourth category description */}
          <CategoryDetail
            image={categoriesWithDetails[3].image}
            title={categoriesWithDetails[3].title}
            color={categoriesWithDetails[3].color}
            description={categoriesWithDetails[3].description}
            features={categoriesWithDetails[3].features}
            showHeader={false}
          />

          {/* Fifth category */}
          <div className="flex items-center gap-10 max-[400px]:gap-5">
            <div className="relative h-[100px] w-[100px] shrink-0 overflow-hidden rounded-full">
              <Image
                src={categoriesWithDetails[4].image}
                fill
                sizes="100px"
                className="object-cover object-center"
                alt={categoriesWithDetails[4].title}
              />
            </div>
            <h2
              className="flex-1 font-playfair text-2xl font-normal leading-[100%] max-[400px]:text-xl"
              style={{ color: categoriesWithDetails[4].color }}
            >
              {categoriesWithDetails[4].title}
            </h2>
          </div>

          {/* Fifth category description */}
          <CategoryDetail
            image={categoriesWithDetails[4].image}
            title={categoriesWithDetails[4].title}
            color={categoriesWithDetails[4].color}
            description={categoriesWithDetails[4].description}
            features={categoriesWithDetails[4].features}
            showHeader={false}
          />

          {/* Banner Mobile 320x100 at the end */}
          <div className="w-full lg:hidden">
            <PromoBanner
              title="[AdSense Big Adaptive • Mobile 320x100 • Banner #2]"
              width={340}
              height={100}
            />
          </div>

          {/* Banner 728x90 Desktop */}
          <div className="hidden w-full lg:block">
            <PromoBanner
              title="[AdSense Adaptive • Desktop (728x90) • Banner #1]"
              width={1160}
              height={90}
            />
          </div>
        </div>
      </div>
      <RecentPostsSection />
      <SiteFooter />
    </div>
  );
}

