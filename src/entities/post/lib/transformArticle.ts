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
  // Обрабатываем URL изображения
  let imageUrl = article.heroImage || "/images/hero_bg.webp";
  
  // Если изображение - полный URL с доменом, преобразуем в относительный путь
  if (imageUrl.startsWith("https://pathvoyager.com/uploads/") || imageUrl.startsWith("http://pathvoyager.com/uploads/")) {
    // Извлекаем относительный путь из полного URL
    imageUrl = imageUrl.replace(/^https?:\/\/[^\/]+/, "");
  } else if (imageUrl.startsWith("/uploads/")) {
    // Для загруженных изображений используем относительный путь
    imageUrl = imageUrl;
  } else if (imageUrl && !imageUrl.startsWith("/") && !imageUrl.startsWith("http")) {
    // Если URL не начинается с / или http, добавляем /
    imageUrl = `/${imageUrl}`;
  }
  
  return {
    id: article.slug,
    title: article.title,
    excerpt: article.excerpt || "",
    image: imageUrl,
    categoryId: article.categoryId,
    authorId: article.authorName || "unknown",
    publishedAt: article.publishedAt,
    readTime: article.readTime || "5 min read",
    tags: [],
  };
};

