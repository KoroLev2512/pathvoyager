import type { Post } from "../model/types";

// Тип статьи с бэкенда
export type BackendArticle = {
  slug: string;
  title: string;
  excerpt: string;
  heroImage: string | null;
  categoryId: string;
  authorName: string | null;
  readTime: string | null;
  publishedAt: string;
  popular?: boolean;
};

// Преобразует статью с бэкенда в формат Post
export const transformBackendArticle = (article: BackendArticle): Post => {
  return {
    id: article.slug,
    title: article.title,
    excerpt: article.excerpt || "",
    image: article.heroImage || "/images/hero_bg.webp",
    categoryId: article.categoryId,
    authorId: article.authorName || "unknown",
    publishedAt: article.publishedAt,
    readTime: article.readTime || "5 min read",
    tags: [],
  };
};

