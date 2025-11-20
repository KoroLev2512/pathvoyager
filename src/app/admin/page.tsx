"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { SiteFooter } from "@/widgets/site-footer/ui/SiteFooter";
import { SiteHeader } from "@/widgets/site-header/ui/SiteHeader";
import { categories } from "@/entities/category/model/data";

// Всегда подключаемся к бэкенду на продакшен сервере
const getApiBaseUrl = (): string => {
  // Используем полный URL продакшена для подключения к бэкенду на сервере
  return "https://pathvoyager.com";
};

const ADMIN_LOGIN = "admin";
const ADMIN_PASSWORD = "aboba-2512";
const STORAGE_KEY = "pathvoyager_admin_authenticated";

const parseContent = (raw: string) => {
  const blocks: Array<
    |
      {
        type: "heading" | "paragraph";
        text: string;
      }
    | { type: "quote"; text: string; author?: string }
    | { type: "list"; items: string[] }
    | { type: "banner"; id: string }
  > = [];

  const flushList = (buffer: string[]) => {
    if (buffer.length > 0) {
      blocks.push({ type: "list", items: [...buffer] });
      buffer.length = 0;
    }
  };

  const listBuffer: string[] = [];

  raw.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList(listBuffer);
      return;
    }

    if (trimmed === "[[banner]]") {
      flushList(listBuffer);
      blocks.push({ type: "banner", id: "inline" });
      return;
    }

    if (trimmed.startsWith("# ")) {
      flushList(listBuffer);
      blocks.push({ type: "heading", text: trimmed.substring(2).trim() });
      return;
    }

    if (trimmed.startsWith("> ")) {
      flushList(listBuffer);
      const [quoteText, author] = trimmed.substring(2).split(" — ");
      blocks.push({ type: "quote", text: quoteText.trim(), author: author?.trim() });
      return;
    }

    if (trimmed.startsWith("- ")) {
      listBuffer.push(trimmed.substring(2).trim());
      return;
    }

    flushList(listBuffer);
    blocks.push({ type: "paragraph", text: trimmed });
  });

  flushList(listBuffer);

  return blocks;
};

const initialForm = {
  title: "",
  slug: "",
  excerpt: "",
  categoryId: categories[0]?.id ?? "digital-nomad",
  heroImage: "",
  authorName: "",
  readTime: "5 min read",
  publishedAt: "",
  contentRaw: "",
};

type ArticleSummary = {
  slug: string;
  title: string;
  categoryId: string;
  publishedAt: string;
  readTime?: string;
};

export default function AdminPage() {
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);

  const categoryOptions = useMemo(() => categories, []);

  useEffect(() => {
    const persisted = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (persisted === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        if (!isAuthenticated) {
          return;
        }
        const apiBaseUrl = getApiBaseUrl();
        const url = apiBaseUrl ? `${apiBaseUrl}/api/articles` : "/api/articles";
        const response = await fetch(url);
        if (!response.ok) {
          setError("Не удалось загрузить статьи. Убедитесь, что запущен бэкенд.");
          return;
        }
        const data = await response.json();
        setArticles(data);
      } catch (err) {
        console.error(err);
        setError("Не удалось загрузить статьи. Убедитесь, что запущен бэкенд.");
      }
    };

    loadArticles();
  }, [isAuthenticated]);

  const handleChange = (field: keyof typeof form) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      const apiBaseUrl = getApiBaseUrl();
      const url = apiBaseUrl ? `${apiBaseUrl}/api/articles` : "/api/articles";
      
      console.log("Sending POST request to:", url);
      
      const requestBody = {
        slug: form.slug,
        title: form.title,
        excerpt: form.excerpt,
        heroImage: form.heroImage || null,
        categoryId: form.categoryId,
        authorName: form.authorName || null,
        readTime: form.readTime || null,
        publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : null,
        content: parseContent(form.contentRaw),
      };
      
      let response;
      try {
        response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });
      } catch (fetchError) {
        // Обработка сетевых ошибок (CORS, таймаут, и т.д.)
        console.error("Fetch error:", fetchError);
        const errorMessage = fetchError instanceof Error 
          ? `Не удалось подключиться к серверу: ${fetchError.message}`
          : "Не удалось подключиться к серверу";
        setError(errorMessage);
        setIsSubmitting(false);
        return;
      }

      if (!response.ok) {
        // Пытаемся получить детали ошибки от сервера
        let errorMessage = "Ошибка при сохранении статьи";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = `Ошибка ${response.status}: ${response.statusText}`;
        }
        setError(errorMessage);
        setIsSubmitting(false);
        return;
      }

      const { slug } = await response.json();
      setMessage(`Статья сохранена. Ссылка: /posts/${slug}`);
      setForm(initialForm);

      // Используем ту же переменную apiBaseUrl, которая уже определена выше
      const refreshUrl = apiBaseUrl ? `${apiBaseUrl}/api/articles` : "/api/articles";
      const updatedArticles = await fetch(refreshUrl).then((res) => res.json());
      setArticles(updatedArticles);
    } catch (err) {
      console.error("Error saving article:", err);
      // Показываем более детальное сообщение об ошибке
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "string") {
        setError(err);
      } else {
        setError("Не удалось сохранить статью. Проверьте подключение к серверу.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError(null);

    if (login === ADMIN_LOGIN && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, "true");
      }
      setLogin("");
      setPassword("");
    } else {
      setAuthError("Неверный логин или пароль.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <div className="flex-1">
        <SiteHeader />

        <main className="w-full bg-white">
        <div className="mx-auto flex w-full max-w-[1160px] flex-col gap-[60px] px-4 py-16 max-[400px]:max-w-[340px] max-[400px]:px-[10px]">
          {!isAuthenticated ? (
            <section className="mx-auto flex w-full max-w-[440px] flex-col gap-6 rounded-2xl border border-[#ececec] px-6 py-8">
              <h1 className="font-playfair text-[32px] font-normal leading-[110%] text-[#333333] text-center">
                Вход в админ-панель
              </h1>
              <p className="font-open-sans text-base leading-[1.6] text-[#767676] text-center">
                Введите логин и пароль, чтобы получить доступ к управлению статьями.
              </p>
              <form className="flex flex-col gap-4" onSubmit={handleLogin}>
                <label className="flex flex-col gap-2">
                  <span className="font-open-sans text-sm uppercase tracking-[0.08em] text-[#767676]">
                    Логин
                  </span>
                  <input
                    type="text"
                    autoComplete="username"
                    value={login}
                    onChange={(event) => setLogin(event.target.value)}
                    className="rounded-lg border border-[#d6d6d6] px-4 py-2 font-open-sans text-base focus:border-[#114b5f] focus:outline-none"
                    placeholder="Введите логин"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="font-open-sans text-sm uppercase tracking-[0.08em] text-[#767676]">
                    Пароль
                  </span>
                  <input
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="rounded-lg border border-[#d6d6d6] px-4 py-2 font-open-sans text-base focus:border-[#114b5f] focus:outline-none"
                    placeholder="Введите пароль"
                  />
                </label>
                {authError && (
                  <p className="rounded-lg bg-[#fff4f4] px-4 py-2 font-open-sans text-sm text-[#cc2a2a] text-center">
                    {authError}
                  </p>
                )}
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-[#114b5f] px-6 py-3 font-open-sans text-base font-semibold text-white transition hover:bg-[#0d2f3c] cursor-pointer"
                >
                  Войти
                </button>
              </form>
            </section>
          ) : (
            <>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-col gap-2">
                    <h1 className="font-playfair text-[40px] font-normal leading-[110%] text-[#333333]">
                      Admin — создание статьи
                    </h1>
                    <p className="font-open-sans text-base leading-[1.6] text-[#767676]">
                      Используйте форму ниже, чтобы подготовить материал для PathVoyager. Контент можно
                      описывать в формате Markdown: <code>#</code> — заголовок, <code>-</code> — элементы списка,
                      <code>&gt;</code> — цитата, <code>[[banner]]</code> — место для баннера внутри текста.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="self-start rounded-full border border-[#d6d6d6] px-4 py-2 font-open-sans text-sm text-[#767676] transition hover:border-[#114b5f] hover:text-[#114b5f] cursor-pointer"
                  >
                    Выйти
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-6 rounded-2xl border border-[#ececec] p-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="flex flex-col gap-2">
                    <span className="font-open-sans text-sm uppercase tracking-[0.08em] text-[#767676]">
                      Заголовок
                    </span>
                    <input
                      required
                      value={form.title}
                      onChange={(event) => handleChange("title")(event.target.value)}
                      className="rounded-lg border border-[#d6d6d6] px-4 py-2 font-open-sans text-base focus:border-[#114b5f] focus:outline-none"
                      placeholder="Например: Time Zone Hacking"
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="font-open-sans text-sm uppercase tracking-[0.08em] text-[#767676]">
                      Слаг (URL)
                    </span>
                    <input
                      required
                      value={form.slug}
                      onChange={(event) => handleChange("slug")(event.target.value)}
                      className="rounded-lg border border-[#d6d6d6] px-4 py-2 font-open-sans text-base focus:border-[#114b5f] focus:outline-none"
                      placeholder="Например: time-zone-hacking"
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="font-open-sans text-sm uppercase tracking-[0.08em] text-[#767676]">
                      Категория
                    </span>
                    <select
                      value={form.categoryId}
                      onChange={(event) => handleChange("categoryId")(event.target.value)}
                      className="rounded-lg border border-[#d6d6d6] px-4 py-2 font-open-sans text-base focus:border-[#114b5f] focus:outline-none"
                    >
                      {categoryOptions.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.title}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="font-open-sans text-sm uppercase tracking-[0.08em] text-[#767676]">
                      Автор
                    </span>
                    <input
                      value={form.authorName}
                      onChange={(event) => handleChange("authorName")(event.target.value)}
                      className="rounded-lg border border-[#d6d6d6] px-4 py-2 font-open-sans text-base focus:border-[#114b5f] focus:outline-none"
                      placeholder="Имя автора"
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="font-open-sans text-sm uppercase tracking-[0.08em] text-[#767676]">
                      Время чтения
                    </span>
                    <input
                      value={form.readTime}
                      onChange={(event) => handleChange("readTime")(event.target.value)}
                      className="rounded-lg border border-[#d6d6d6] px-4 py-2 font-open-sans text-base focus:border-[#114b5f] focus:outline-none"
                      placeholder="Например: 5 min read"
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="font-open-sans text-sm uppercase tracking-[0.08em] text-[#767676]">
                      Дата публикации
                    </span>
                    <input
                      type="date"
                      value={form.publishedAt}
                      onChange={(event) => handleChange("publishedAt")(event.target.value)}
                      className="rounded-lg border border-[#d6d6d6] px-4 py-2 font-open-sans text-base focus:border-[#114b5f] focus:outline-none"
                    />
                  </label>
                </div>

                <label className="flex flex-col gap-2">
                  <span className="font-open-sans text-sm uppercase tracking-[0.08em] text-[#767676]">
                    Краткое описание
                  </span>
                  <textarea
                    value={form.excerpt}
                    onChange={(event) => handleChange("excerpt")(event.target.value)}
                    className="min-h-[100px] rounded-lg border border-[#d6d6d6] px-4 py-2 font-open-sans text-base focus:border-[#114b5f] focus:outline-none"
                    placeholder="Короткое описание для карточки"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="font-open-sans text-sm uppercase tracking-[0.08em] text-[#767676]">
                    Обложка (URL)
                  </span>
                  <input
                    value={form.heroImage}
                    onChange={(event) => handleChange("heroImage")(event.target.value)}
                    className="rounded-lg border border-[#d6d6d6] px-4 py-2 font-open-sans text-base focus:border-[#114b5f] focus:outline-none"
                    placeholder="https://..."
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="font-open-sans text-sm uppercase tracking-[0.08em] text-[#767676]">
                    Контент статьи
                  </span>
                  <textarea
                    required
                    value={form.contentRaw}
                    onChange={(event) => handleChange("contentRaw")(event.target.value)}
                    className="min-h-[220px] rounded-lg border border-[#d6d6d6] px-4 py-2 font-open-sans text-base focus:border-[#114b5f] focus:outline-none"
                    placeholder={`# Заголовок блока\nКороткий абзац\n- пункт списка`}
                  />
                </label>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 inline-flex items-center justify-center rounded-full bg-[#114b5f] px-6 py-3 font-open-sans text-base font-semibold text-white transition hover:bg-[#0d2f3c] cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Сохранение..." : "Сохранить статью"}
                </button>

                {message && (
                  <p className="rounded-lg bg-[#ecf8f4] px-4 py-2 font-open-sans text-sm text-[#114b5f]">
                    {message}
                  </p>
                )}
                {error && (
                  <p className="rounded-lg bg-[#fff4f4] px-4 py-2 font-open-sans text-sm text-[#cc2a2a]">
                    {error}
                  </p>
                )}
              </form>

              <section className="flex flex-col gap-4">
                <h2 className="font-playfair text-2xl font-normal leading-[110%] text-[#333333]">
                  Последние статьи
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-[#ececec]">
                    <thead className="bg-[#f8f9fa]">
                      <tr>
                        <th className="px-4 py-3 text-left font-open-sans text-sm font-semibold uppercase tracking-[0.06em] text-[#767676]">
                          Слаг
                        </th>
                        <th className="px-4 py-3 text-left font-open-sans text-sm font-semibold uppercase tracking-[0.06em] text-[#767676]">
                          Заголовок
                        </th>
                        <th className="px-4 py-3 text-left font-open-sans text-sm font-semibold uppercase tracking-[0.06em] text-[#767676]">
                          Категория
                        </th>
                        <th className="px-4 py-3 text-left font-open-sans text-sm font-semibold uppercase tracking-[0.06em] text-[#767676]">
                          Дата
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0f0f0]">
                      {articles.map((article) => (
                        <tr key={article.slug} className="hover:bg-[#fafafa]">
                          <td className="px-4 py-3 font-open-sans text-sm text-[#114b5f]">
                            <a
                              href={`/posts/${article.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="underline hover:no-underline"
                            >
                              {article.slug}
                            </a>
                          </td>
                          <td className="px-4 py-3 font-open-sans text-sm text-[#333333]">{article.title}</td>
                          <td className="px-4 py-3 font-open-sans text-sm text-[#767676]">{article.categoryId}</td>
                          <td className="px-4 py-3 font-open-sans text-sm text-[#767676]">
                            {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : "—"}
                          </td>
                        </tr>
                      ))}
                      {articles.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-4 py-6 text-center font-open-sans text-sm text-[#767676]">
                            Статей пока нет.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}
        </div>
      </main>
      </div>
      <SiteFooter />
    </div>
  );
}
