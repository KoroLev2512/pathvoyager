"use client";

import { useMemo, useState } from "react";
import { recentArticlesMocks, popularArticlesMocks } from "@/shared/mocks";
import { categories } from "@/entities/category/model/data";
import { PostCard } from "@/entities/post/ui/PostCard";
import { PromoBanner } from "@/shared/ui/PromoBanner";

const categoriesMap = Object.fromEntries(
  categories.map((category) => [category.id, category]),
);

// Объединяем все статьи и сортируем по убыванию новизны
const articlesMap = new Map(
  [...popularArticlesMocks, ...recentArticlesMocks].map((article) => [article.id, article]),
);

const allArticles = Array.from(articlesMap.values()).sort((a, b) => {
  const dateA = new Date(a.publishedAt).getTime();
  const dateB = new Date(b.publishedAt).getTime();
  return dateB - dateA;
});

const ARTICLES_PER_PAGE = 5;

export const RecentPostsSection = () => {
  const [page, setPage] = useState<number>(1);

  const paginatedArticles = useMemo(() => {
    return allArticles.slice(0, page * ARTICLES_PER_PAGE);
  }, [page]);

  const hasMore = paginatedArticles.length < allArticles.length;

  // Функция для генерации фиксированного случайного столбца для баннера (0, 1 или 2)
  const getBannerColumn = (groupIndex: number): number => {
    const seed = groupIndex * 7919;
    return seed % 3; // Столбец от 0 до 2 (для индексации массива)
  };

  const articlesWithBanner = useMemo(() => {
    const items: Array<{ type: "post"; id: string } | { type: "banner"; id: string }> = [];

    // Разбиваем статьи на группы по 5
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

  return (
    <div className="relative w-full bg-white py-12">
      <div className="mx-auto flex w-full max-w-[1160px] flex-col gap-[60px] px-4 max-[400px]:max-w-[340px] max-[400px]:px-[10px]">
        <h2 className="font-playfair text-2xl font-normal leading-[100%] text-[#333333] text-center sm:text-[32px]">
          Recent articles
        </h2>
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
            const category = categoriesMap[article.categoryId];
            if (!category) return null;

            return (
              <div key={article.id} className="flex justify-center lg:justify-start">
                <PostCard post={article} category={category} />
              </div>
            );
          })}
        </div>
        {hasMore && (
          <p
            className="text-center font-open-sans text-base text-[#767676] cursor-pointer transition hover:opacity-80"
            onClick={() => setPage((prev) => prev + 1)}
          >
            Read more
          </p>
        )}
      </div>
    </div>
  );
};


