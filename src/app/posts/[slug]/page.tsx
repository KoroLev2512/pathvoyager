import type { Metadata } from "next";
import React from "react";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/widgets/site-footer/ui/SiteFooter";
import { SiteHeader } from "@/widgets/site-header/ui/SiteHeader";
import { PromoBanner } from "@/shared/ui/PromoBanner";
import { categories } from "@/entities/category/model/data";
import { articleDetailsMocks } from "@/shared/mocks/articleDetails";
import { popularArticlesMocks, recentArticlesMocks } from "@/shared/mocks";

import { getApiBaseUrl } from "@/shared/lib/getApiBaseUrl";
import { ArticleImage } from "@/entities/post/ui/ArticleImage";

const categoriesMap = Object.fromEntries(
  categories.map((category) => [category.id, category]),
);
const FALLBACK_IMAGE = "/images/mock.webp";

// Создаем маппинг из всех моков: сначала детальные статьи, потом базовые
const allMocksMap = new Map<string, typeof articleDetailsMocks[number] | typeof popularArticlesMocks[number] | typeof recentArticlesMocks[number]>();

// Добавляем детальные статьи (приоритет)
articleDetailsMocks.forEach((article) => {
  allMocksMap.set(article.id, article);
});

// Добавляем базовые статьи (fallback)
[...popularArticlesMocks, ...recentArticlesMocks].forEach((article) => {
  if (!allMocksMap.has(article.id)) {
    allMocksMap.set(article.id, article);
  }
});

// Принудительно используем динамический рендеринг, чтобы новые статьи были доступны сразу
export const dynamic = 'force-dynamic';
export const revalidate = 0;

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const articleFromApi = await fetchArticleFromApi(slug);
  const mockArticle = allMocksMap.get(slug);

  let article: ArticleResponse | typeof articleDetailsMocks[number] | typeof popularArticlesMocks[number] | typeof recentArticlesMocks[number] | null = articleFromApi;

  if (!article && mockArticle) {
    article = mockArticle;
  }

  if (!article) {
    return {
      title: "Article Not Found",
    };
  }

  const normalizedArticle = normalizeArticle(article, slug);
  const category = categoriesMap[normalizedArticle.categoryId];
  const imageUrl = getArticleImage(article);
  const apiBaseUrl = getApiBaseUrl();
  const fullImageUrl = imageUrl.startsWith("http") ? imageUrl : `${apiBaseUrl}${imageUrl}`;

  return {
    title: normalizedArticle.title,
    description: normalizedArticle.excerpt || `${normalizedArticle.title} - Expert travel guide from PathVoyager.`,
    keywords: [
      normalizedArticle.title.toLowerCase(),
      category?.title.toLowerCase() || "",
      "travel guide",
      "travel tips",
      "travel article",
    ].filter(Boolean),
    authors: normalizedArticle.authorName ? [{ name: normalizedArticle.authorName }] : undefined,
    openGraph: {
      title: normalizedArticle.title,
      description: normalizedArticle.excerpt || `${normalizedArticle.title} - Expert travel guide.`,
      url: `${apiBaseUrl}/posts/${slug}`,
      type: "article",
      publishedTime: normalizedArticle.publishedAt,
      authors: normalizedArticle.authorName ? [normalizedArticle.authorName] : undefined,
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: normalizedArticle.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: normalizedArticle.title,
      description: normalizedArticle.excerpt || `${normalizedArticle.title} - Expert travel guide.`,
      images: [fullImageUrl],
    },
    alternates: {
      canonical: `${apiBaseUrl}/posts/${slug}`,
    },
  };
}

type ArticleResponse = {
  slug: string;
  title: string;
  excerpt?: string;
  heroImage?: string;
  categoryId: string;
  authorName?: string;
  readTime?: string;
  publishedAt?: string;
  content: Array<
    | { type: "heading"; level: number; text: string }
    | { type: "paragraph"; text: string }
    | { type: "quote"; text: string; author?: string }
    | { type: "list"; items: string[]; ordered?: boolean }
    | { type: "banner"; id: string }
    | { type: "code"; code: string; language?: string }
    | { type: "table"; headers: string[]; rows: string[][] }
    | { type: "hr" }
    | { type: "link"; text: string; url: string }
    | { type: "image"; alt: string; url: string }
  >;
};

const fetchArticleFromApi = async (slug: string): Promise<ArticleResponse | null> => {
  try {
    const apiBaseUrl = getApiBaseUrl();
    // Формируем URL для запроса
    const url = apiBaseUrl 
      ? `${apiBaseUrl}/api/articles/${slug}`
      : `/api/articles/${slug}`;
    
    const response = await fetch(url, {
      cache: 'no-store', // Отключаем кеширование полностью для динамического контента
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return {
      slug: data.slug,
      title: data.title,
      excerpt: data.excerpt ?? undefined,
      heroImage: data.heroImage ?? undefined,
      categoryId: data.categoryId,
      authorName: data.authorName ?? undefined,
      readTime: data.readTime ?? undefined,
      publishedAt: data.publishedAt ?? undefined,
      content: data.content ?? [],
    };
  } catch (error) {
    console.error("Failed to fetch article from API", error);
    return null;
  }
};

// Функция для парсинга inline markdown
const parseInlineMarkdown = (text: string): React.ReactNode => {
  if (!text) return text;
  
  const parts: React.ReactNode[] = [];
  let key = 0;
  let processedText = text;

  // Сначала заменяем все **bold** на плейсхолдеры
  const boldPlaceholders: { [key: string]: string } = {};
  let boldCounter = 0;
  processedText = processedText.replace(/\*\*(.+?)\*\*/g, (match, content) => {
    const placeholder = `__BOLD_${boldCounter}__`;
    boldPlaceholders[placeholder] = content;
    boldCounter++;
    return placeholder;
  });

  // Затем заменяем ==highlight== (выделение желтым)
  const markPlaceholders: { [key: string]: string } = {};
  let markCounter = 0;
  processedText = processedText.replace(/==(.+?)==/g, (match, content) => {
    const placeholder = `__MARK_${markCounter}__`;
    markPlaceholders[placeholder] = content;
    markCounter++;
    return placeholder;
  });

  // Затем заменяем ++underline++ (подчеркивание)
  const underlinePlaceholders: { [key: string]: string } = {};
  let underlineCounter = 0;
  processedText = processedText.replace(/\+\+(.+?)\+\+/g, (match, content) => {
    const placeholder = `__UNDERLINE_${underlineCounter}__`;
    underlinePlaceholders[placeholder] = content;
    underlineCounter++;
    return placeholder;
  });

  // Теперь обрабатываем *italic* (не **, так как они уже заменены)
  const italicPlaceholders: { [key: string]: string } = {};
  let italicCounter = 0;
  processedText = processedText.replace(/\*([^*\n]+?)\*/g, (match, content) => {
    const placeholder = `__ITALIC_${italicCounter}__`;
    italicPlaceholders[placeholder] = content;
    italicCounter++;
    return placeholder;
  });

  // Разбиваем на части и восстанавливаем форматирование
  const tokens = processedText.split(/(__\w+_\d+__)/g);
  
  tokens.forEach((token) => {
    if (token.startsWith('__BOLD_')) {
      const content = boldPlaceholders[token];
      if (content) {
        parts.push(<strong key={key++}>{parseInlineMarkdown(content)}</strong>);
      }
    } else if (token.startsWith('__MARK_')) {
      const content = markPlaceholders[token];
      if (content) {
        parts.push(<mark key={key++} className="bg-yellow-200 px-1">{parseInlineMarkdown(content)}</mark>);
      }
    } else if (token.startsWith('__UNDERLINE_')) {
      const content = underlinePlaceholders[token];
      if (content) {
        parts.push(<u key={key++}>{parseInlineMarkdown(content)}</u>);
      }
    } else if (token.startsWith('__ITALIC_')) {
      const content = italicPlaceholders[token];
      if (content) {
        parts.push(<em key={key++}>{parseInlineMarkdown(content)}</em>);
      }
    } else if (token) {
      parts.push(token);
    }
  });

  return parts.length > 0 ? <>{parts}</> : text;
};

const renderContentBlock = (
  block: ArticleResponse["content"][number],
  index: number,
) => {
  switch (block.type) {
    case "heading": {
      const level = Math.min(Math.max(block.level, 1), 6);
      const headingClasses = {
        1: "font-playfair text-4xl font-normal leading-[110%] text-[#333333]",
        2: "font-playfair text-[28px] font-normal leading-[110%] text-[#333333]",
        3: "font-playfair text-2xl font-normal leading-[110%] text-[#333333]",
        4: "font-playfair text-xl font-normal leading-[110%] text-[#333333]",
        5: "font-playfair text-lg font-normal leading-[110%] text-[#333333]",
        6: "font-playfair text-base font-normal leading-[110%] text-[#333333]",
      };
      const className = headingClasses[level as keyof typeof headingClasses] || headingClasses[2];
      const content = parseInlineMarkdown(block.text);
      
      switch (level) {
        case 1:
          return <h1 key={`heading-${index}`} className={className}>{content}</h1>;
        case 2:
          return <h2 key={`heading-${index}`} className={className}>{content}</h2>;
        case 3:
          return <h3 key={`heading-${index}`} className={className}>{content}</h3>;
        case 4:
          return <h4 key={`heading-${index}`} className={className}>{content}</h4>;
        case 5:
          return <h5 key={`heading-${index}`} className={className}>{content}</h5>;
        case 6:
          return <h6 key={`heading-${index}`} className={className}>{content}</h6>;
        default:
          return <h2 key={`heading-${index}`} className={className}>{content}</h2>;
      }
    }
    case "paragraph":
      return (
        <p key={`paragraph-${index}`} className="font-open-sans text-base leading-[1.7] text-[#333333]">
          {parseInlineMarkdown(block.text)}
        </p>
      );
    case "quote":
      return (
        <blockquote key={`quote-${index}`} className="border-l-4 border-[#114b5f] pl-5 my-4">
          <p className="font-playfair text-xl leading-[1.6] text-[#114b5f]">{parseInlineMarkdown(block.text)}</p>
          {block.author && (
            <cite className="mt-2 block font-open-sans text-sm uppercase tracking-[0.08em] text-[#767676]">
              {block.author}
            </cite>
          )}
        </blockquote>
      );
    case "list":
      if (block.ordered) {
        return (
          <ol key={`list-${index}`} className="ml-5 list-decimal space-y-2">
            {block.items.map((item, itemIndex) => (
              <li key={`${index}-${itemIndex}`} className="font-open-sans text-base leading-[1.7] text-[#333333]">
                {parseInlineMarkdown(item)}
              </li>
            ))}
          </ol>
        );
      }
      return (
        <ul key={`list-${index}`} className="ml-5 list-disc space-y-2">
          {block.items.map((item, itemIndex) => (
            <li key={`${index}-${itemIndex}`} className="font-open-sans text-base leading-[1.7] text-[#333333]">
              {parseInlineMarkdown(item)}
            </li>
          ))}
        </ul>
      );
    case "code":
      return (
        <pre key={`code-${index}`} className="bg-gray-100 rounded-lg p-4 overflow-x-auto my-4">
          <code className={`text-sm font-mono ${block.language ? `language-${block.language}` : ''}`}>
            {block.code}
          </code>
        </pre>
      );
    case "table":
      return (
        <div key={`table-${index}`} className="overflow-x-auto my-4">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                {block.headers.map((header, headerIndex) => (
                  <th key={headerIndex} className="border border-gray-300 px-4 py-2 text-left font-semibold">
                    {parseInlineMarkdown(header)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="border border-gray-300 px-4 py-2">
                      {parseInlineMarkdown(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "hr":
      return <hr key={`hr-${index}`} className="my-6 border-t border-gray-300" />;
    case "banner":
      return (
        <div key={`banner-${index}`} className="flex w-full justify-center my-4">
          <PromoBanner
            title="[AdSense Rectangle • Desktop 300x250 • Banner #2]"
            variant="vertical"
            width={300}
            height={250}
          />
        </div>
      );
    default:
      return null;
  }
};

const getArticleImage = (
  article: ArticleResponse | typeof articleDetailsMocks[number] | typeof popularArticlesMocks[number] | typeof recentArticlesMocks[number],
): string => {
  let imageUrl = FALLBACK_IMAGE;
  
  if ("heroImage" in article && article.heroImage) {
    imageUrl = article.heroImage;
  } else if ("coverImage" in article && article.coverImage) {
    imageUrl = article.coverImage;
  } else if ("image" in article && article.image) {
    imageUrl = article.image;
  }
  
  // Преобразуем полный URL в относительный путь для загруженных изображений
  if (imageUrl.startsWith("https://pathvoyager.com/uploads/") || imageUrl.startsWith("http://pathvoyager.com/uploads/")) {
    imageUrl = imageUrl.replace(/^https?:\/\/[^\/]+/, "");
  }
  
  return imageUrl || FALLBACK_IMAGE;
};

type NormalizedArticle = {
  slug: string;
  title: string;
  excerpt?: string;
  categoryId: string;
  publishedAt?: string;
  readTime?: string;
  authorName?: string;
  content: ArticleResponse["content"];
};

const normalizeArticle = (
  article: ArticleResponse | typeof articleDetailsMocks[number] | typeof popularArticlesMocks[number] | typeof recentArticlesMocks[number],
  fallbackSlug: string,
): NormalizedArticle => {
  if ("content" in article && Array.isArray(article.content)) {
    const resolvedSlug = "slug" in article ? article.slug : "id" in article ? article.id : fallbackSlug;
    
    // Преобразуем старые блоки контента в новый формат
    const normalizedContent = article.content.map((block) => {
      // Если это старый формат заголовка без level, добавляем level: 2
      if (block.type === "heading" && !("level" in block)) {
        return { ...block, level: 2 };
      }
      // Если это старый формат списка без ordered, добавляем ordered: false
      if (block.type === "list" && !("ordered" in block)) {
        return { ...block, ordered: false };
      }
      return block;
    }) as ArticleResponse["content"];
    
    return {
      slug: resolvedSlug,
      title: article.title,
      excerpt: article.excerpt,
      categoryId: article.categoryId,
      publishedAt: article.publishedAt,
      readTime: article.readTime,
      authorName: "authorName" in article ? article.authorName : undefined,
      content: normalizedContent,
    };
  }
  
  // Для базовых статей без контента создаем минимальную версию
  return {
    slug: "id" in article ? article.id : fallbackSlug,
    title: article.title,
    excerpt: article.excerpt,
    categoryId: article.categoryId,
    publishedAt: article.publishedAt,
    readTime: article.readTime,
    authorName: "authorName" in article ? article.authorName : undefined,
    content: [
      {
        type: "paragraph",
        text: article.excerpt || "Содержание статьи будет добавлено позже.",
      },
    ],
  };
};

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const articleFromApi = await fetchArticleFromApi(slug);
  const mockArticle = allMocksMap.get(slug);
  
  // Если статья из API - используем её, иначе ищем в моках
  let article: ArticleResponse | typeof articleDetailsMocks[number] | typeof popularArticlesMocks[number] | typeof recentArticlesMocks[number] | null = articleFromApi;
  
  if (!article && mockArticle) {
    article = mockArticle;
  }

  if (!article) {
    notFound();
  }

  const normalizedArticle = normalizeArticle(article, slug);
  const category = categoriesMap[normalizedArticle.categoryId];
  const imageUrl = getArticleImage(article);
  const apiBaseUrl = getApiBaseUrl();
  const fullImageUrl = imageUrl.startsWith("http") ? imageUrl : `${apiBaseUrl}${imageUrl}`;

  // Структурированные данные для SEO (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: normalizedArticle.title,
    description: normalizedArticle.excerpt || normalizedArticle.title,
    image: fullImageUrl,
    datePublished: normalizedArticle.publishedAt || new Date().toISOString(),
    dateModified: normalizedArticle.publishedAt || new Date().toISOString(),
    author: normalizedArticle.authorName
      ? {
          "@type": "Person",
          name: normalizedArticle.authorName,
        }
      : {
          "@type": "Organization",
          name: "PathVoyager",
        },
    publisher: {
      "@type": "Organization",
      name: "PathVoyager",
      logo: {
        "@type": "ImageObject",
        url: "https://pathvoyager.com/images/hero_bg.webp",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://pathvoyager.com/posts/${slug}`,
    },
    articleSection: category?.title || "Travel",
    keywords: [
      normalizedArticle.title,
      category?.title || "",
      "travel guide",
      "travel tips",
    ].filter(Boolean),
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex-1">
        <SiteHeader />

        <main className="w-full bg-white">
        <div className="mx-auto flex w-full max-w-[1160px] flex-col gap-[80px] px-4 py-16 max-[400px]:max-w-[340px] max-[400px]:px-[10px] lg:gap-[60px]">
          <div className="flex flex-col gap-[40px] lg:flex-row lg:items-start lg:gap-[60px]">
            <article className="flex w-full flex-1 flex-col gap-[32px]">
              <div className="flex flex-col gap-5">
                <span className="font-open-sans text-sm uppercase tracking-[0.08em] text-[#114b5f]">
                  {category?.title ?? "Article"}
                </span>
                <h1 className="font-playfair text-[40px] font-normal leading-[110%] text-[#333333]">
                  {normalizedArticle.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 font-open-sans text-sm text-[#767676]">
                  {normalizedArticle.publishedAt && (
                    <span>{new Date(normalizedArticle.publishedAt).toLocaleDateString()}</span>
                  )}
                  {normalizedArticle.publishedAt && normalizedArticle.readTime && <span>•</span>}
                  {normalizedArticle.readTime && <span>{normalizedArticle.readTime}</span>}
                </div>
              </div>

              <div className="relative h-[420px] w-full overflow-hidden">
                <ArticleImage
                  src={getArticleImage(article)}
                  alt={normalizedArticle.title}
                  sizes="(min-width: 1024px) 720px, 100vw"
                  priority
                  imgClassName="h-full w-full object-cover object-center"
                  imageClassName="object-cover object-center"
                />
              </div>

              <div className="flex flex-col gap-8">
                {normalizedArticle.content.map((block, index) => renderContentBlock(block, index))}
              </div>
            </article>

            <aside className="flex w-full flex-col items-center gap-10 lg:w-[320px] lg:items-start">
              <PromoBanner
                title="[AdSense Rectangle • Desktop 300x250 • Banner #2]"
                variant="vertical"
                width={300}
                height={250}
              />
              <PromoBanner
                title="[(300x600) • Banner]"
                variant="vertical"
                width={300}
                height={600}
              />
            </aside>
          </div>

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
