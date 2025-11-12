"use client";

import { useMemo, useState } from "react";
import { SiteFooter } from "@/widgets/site-footer/ui/SiteFooter";
import { SiteHeader } from "@/widgets/site-header/ui/SiteHeader";
import { PromoBanner } from "@/shared/ui/PromoBanner";
import { categories } from "@/entities/category/model/data";
import { PostCard } from "@/entities/post/ui/PostCard";
import { popularArticlesMocks, recentArticlesMocks } from "@/shared/mocks";

const articlesMap = new Map(
  [...popularArticlesMocks, ...recentArticlesMocks].map((article) => [article.id, article]),
);

const allArticles = Array.from(articlesMap.values()).sort((a, b) => {
  const dateA = new Date(a.publishedAt).getTime();
  const dateB = new Date(b.publishedAt).getTime();
  return dateB - dateA;
});

const categoryOptions = [{ id: "all", title: "All", color: "#333333" }, ...categories];

const categoryMap = Object.fromEntries(categories.map((category) => [category.id, category]));

const ARTICLES_PER_PAGE = 8;
const BANNER_INSERT_INDEX = 3;

export default function Travel() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [page, setPage] = useState<number>(1);

  const filteredArticles = useMemo(() => {
    if (activeCategory === "all") {
      return allArticles;
    }

    return allArticles.filter((article) => article.categoryId === activeCategory);
  }, [activeCategory]);

  const paginatedArticles = useMemo(() => {
    return filteredArticles.slice(0, page * ARTICLES_PER_PAGE);
  }, [filteredArticles, page]);

  const hasMore = paginatedArticles.length < filteredArticles.length;

  const articlesWithBanner = useMemo(() => {
    const items: Array<{ type: "post"; id: string } | { type: "banner"; id: string }> = [];

    paginatedArticles.forEach((article, index) => {
      if (index === BANNER_INSERT_INDEX) {
        items.push({ type: "banner", id: `banner-${page}` });
      }
      items.push({ type: "post", id: article.id });
    });

    return items;
  }, [paginatedArticles, page]);

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    setPage(1);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <div className="flex-1">
        <SiteHeader />

        <section className="relative h-[180px] w-full bg-[#114b5f] border-[10px] border-white">
        <h1 className="absolute left-1/2 top-[70px] -translate-x-1/2 font-playfair text-2xl font-normal leading-[100%] text-white text-center md:text-[32px]">
          Travel Blog
        </h1>
      </section>

      <main className="w-full bg-white">
        <div className="mx-auto flex w-full max-w-[1160px] flex-col gap-[60px] px-4 py-12 max-[400px]:max-w-[340px] max-[400px]:px-[10px]">
          <div className="flex flex-col gap-5">
            <h2 className="font-playfair text-2xl font-normal leading-[100%] text-[#333333] sm:text-[32px]">
              Categories
            </h2>
            <div className="flex flex-wrap gap-[18px]">
              {categoryOptions.map((categoryOption) => {
                const isActive = activeCategory === categoryOption.id;
                const categoryColor = categoryOption.color;

                return (
                  <button
                    key={categoryOption.id}
                    type="button"
                    onClick={() => handleCategoryChange(categoryOption.id)}
                    className={`cursor-pointer rounded-full px-5 py-2 text-sm font-open-sans transition ${
                      isActive ? "shadow" : "bg-transparent"
                    }`}
                    style={{
                      backgroundColor: isActive ? categoryColor : "transparent",
                      color: isActive ? "#ffffff" : categoryColor,
                      border: isActive ? `1px solid ${categoryColor}` : "none",
                    }}
                  >
                    {categoryOption.title}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {articlesWithBanner.map((item) => {
              if (item.type === "banner") {
                return (
                  <div
                    key={item.id}
                    className="hidden h-full w-full items-start justify-center lg:flex"
                  >
                    <PromoBanner
                      title="[AdSense Rectangle • Desktop 300x250 • Banner #2]"
                      variant="vertical"
                      width={300}
                      height={250}
                    />
                  </div>
                );
              }

              const article = paginatedArticles.find((post) => post.id === item.id);
              if (!article) return null;
              const category = categoryMap[article.categoryId];
              if (!category) return null;

              return (
                <div key={article.id} className="flex justify-center lg:justify-start">
                  <PostCard post={article} category={category} />
                </div>
              );
            })}
          </div>

          {paginatedArticles.length === 0 && (
            <div className="flex w-full flex-col items-center gap-4 rounded-2xl border border-dashed border-[#d6d6d6] px-6 py-16 text-center">
              <p className="font-playfair text-2xl text-[#333333]">No articles yet</p>
              <p className="font-open-sans text-base text-[#767676]">
                We&apos;re preparing new stories for this category. Try choosing another one or check back soon.
              </p>
            </div>
          )}

          {hasMore && (
            <p
              className="text-center font-open-sans text-base text-[#767676] cursor-pointer transition hover:opacity-80"
              onClick={() => setPage((prev) => prev + 1)}
            >
              Read more
            </p>
          )}

          <div className="w-full">
            <PromoBanner
              title="[AdSense Adaptive • Desktop (728x90) • Banner #1]"
              width="100%"
              height={90}
            />
          </div>
        </div>
      </main>
      </div>
      <SiteFooter />
    </div>
  );
}
