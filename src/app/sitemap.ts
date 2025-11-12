import type { MetadataRoute } from "next";
import { popularArticlesMocks, recentArticlesMocks } from "@/shared/mocks";
import { articleDetailsMocks } from "@/shared/mocks/articleDetails";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://pathvoyager.com";

  // Статические страницы
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/travel`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date("2025-01-15"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: new Date("2025-10-11"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Динамические страницы статей
  const allArticles = [
    ...articleDetailsMocks,
    ...popularArticlesMocks,
    ...recentArticlesMocks,
  ];

  // Убираем дубликаты по id
  const uniqueArticles = Array.from(
    new Map(allArticles.map((article) => [article.id, article])).values(),
  );

  const articlePages: MetadataRoute.Sitemap = uniqueArticles.map((article) => ({
    url: `${baseUrl}/posts/${article.id}`,
    lastModified: article.publishedAt ? new Date(article.publishedAt) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...articlePages];
}

