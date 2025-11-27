"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { popularArticlesMocks } from "@/shared/mocks";
import { categories } from "@/entities/category/model/data";
import { PostCard } from "@/entities/post/ui/PostCard";
import { PromoBanner } from "@/shared/ui/PromoBanner";
import { transformBackendArticle, type BackendArticle } from "@/entities/post/lib/transformArticle";
import type { Post } from "@/entities/post/model/types";

const categoriesMap = Object.fromEntries(
  categories.map((category) => [category.id, category]),
);

import { getApiBaseUrl } from "@/shared/lib/getApiBaseUrl";

export const PopularPostsSection = () => {
  const [backendArticles, setBackendArticles] = useState<Post[]>([]);

  // Загружаем популярные статьи с бэкенда
  useEffect(() => {
    const loadBackendArticles = async () => {
      try {
        const apiBaseUrl = getApiBaseUrl();
        const url = apiBaseUrl ? `${apiBaseUrl}/api/articles` : "/api/articles";
        const response = await fetch(url);
        
        if (response.ok) {
          const data: BackendArticle[] = await response.json();
          // Фильтруем только популярные статьи
          const popularBackendArticles = data
            .filter((article) => article.popular === true)
            .map(transformBackendArticle);
          setBackendArticles(popularBackendArticles);
        }
      } catch (error) {
        console.error("Failed to load backend articles:", error);
      }
    };

    loadBackendArticles();
  }, []);

  // Объединяем популярные статьи с бэкенда и моки
  const popularArticles = useMemo(() => {
    const articlesMap = new Map<string, Post>();
    
    // Добавляем моки
    popularArticlesMocks.forEach((article) => {
      articlesMap.set(article.id, article);
    });
    
    // Добавляем популярные статьи с бэкенда (перезаписывают моки с тем же id)
    backendArticles.forEach((article) => {
      articlesMap.set(article.id, article);
    });
    
    return Array.from(articlesMap.values());
  }, [backendArticles]);

  // Создаем массив элементов: первые 3 статьи, затем баннер, затем остальные статьи
  const items = useMemo(() => {
    return [
      ...popularArticles.slice(0, 3).map((post) => ({ type: "post" as const, post })),
      { type: "banner" as const, id: "banner-1" },
      ...popularArticles.slice(3, 5).map((post) => ({ type: "post" as const, post })),
      ...popularArticles.slice(5, 8).map((post) => ({ type: "post" as const, post })),
    ];
  }, [popularArticles]);

  return (
    <div className="relative w-full bg-white py-12">
      <div className="mx-auto flex w-full max-w-[1160px] flex-col gap-[60px] px-4 max-[400px]:max-w-[340px] max-[400px]:px-[10px]">
        <h2 className="font-playfair text-2xl font-normal leading-[100%] text-[#333333] text-center sm:text-[32px]">
          Popular articles
        </h2>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
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

            const category = categoriesMap[item.post.categoryId];
            if (!category) return null;

            return (
              <div key={item.post.id} className="flex justify-center lg:justify-start">
                <PostCard post={item.post} category={category} />
              </div>
            );
          })}
        </div>
        <Link
          href="/travel"
          className="text-center font-open-sans text-base text-[#767676] cursor-pointer transition hover:opacity-80"
        >
          Read more
        </Link>
        <div className="w-full">
          <PromoBanner
            title="[AdSense Adaptive • Desktop (728x90) • Banner #1]"
            width="100%"
            height={90}
          />
        </div>
      </div>
    </div>
  );
};


