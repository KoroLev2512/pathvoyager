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

// Функция для генерации фиксированного случайного столбца для баннера (0, 1 или 2)
const getBannerColumn = (groupIndex: number): number => {
  const seed = groupIndex * 7919;
  return seed % 3; // Столбец от 0 до 2 (для индексации массива)
};

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

    // Разбиваем статьи на группы по 8
    const groups: typeof allArticles[] = [];
    for (let i = 0; i < paginatedArticles.length; i += ARTICLES_PER_PAGE) {
      groups.push(paginatedArticles.slice(i, i + ARTICLES_PER_PAGE));
    }

    groups.forEach((group, groupIndex) => {
      // Получаем фиксированный случайный столбец для баннера (0, 1 или 2)
      const bannerColumn = getBannerColumn(groupIndex);
      
      // Вычисляем позицию в группе, где должен быть баннер, чтобы попасть в нужный столбец
      // Учитываем текущее количество элементов в items для правильного позиционирования
      const currentItemsCount = items.length;
      const targetColumn = bannerColumn;
      
      // Находим позицию в группе, которая даст нужный столбец в сетке
      // Формула: (currentItemsCount + positionInGroup) % 3 === targetColumn
      let bannerPositionInGroup = -1;
      for (let pos = 1; pos < group.length; pos++) {
        if ((currentItemsCount + pos) % 3 === targetColumn) {
          bannerPositionInGroup = pos;
          break;
        }
      }
      
      // Если не нашли подходящую позицию, используем случайную (но не первую и не последнюю)
      if (bannerPositionInGroup === -1) {
        const seed = groupIndex * 7919;
        bannerPositionInGroup = (seed % (group.length - 2)) + 1;
      }

      group.forEach((article, articleIndex) => {
        items.push({ type: "post", id: article.id });
        
        // Вставляем баннер в позицию, которая попадет в нужный столбец
        if (articleIndex === bannerPositionInGroup - 1) {
          items.push({ type: "banner", id: `banner-${groupIndex}-${bannerPositionInGroup}` });
        }
      });
    });

    return items;
  }, [paginatedArticles]);

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
