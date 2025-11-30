"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { SiteFooter } from "@/widgets/site-footer/ui/SiteFooter";
import { SiteHeader } from "@/widgets/site-header/ui/SiteHeader";
import { categories } from "@/entities/category/model/data";

import { getApiBaseUrl } from "@/shared/lib/getApiBaseUrl";

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

// Преобразует контент обратно в raw формат для редактирования
type ContentBlock =
  | { type: "heading" | "paragraph"; text: string }
  | { type: "quote"; text: string; author?: string }
  | { type: "list"; items: string[] }
  | { type: "banner"; id: string };

const formatContentRaw = (content: ContentBlock[]): string => {
  if (!Array.isArray(content)) return "";
  
  return content.map((block) => {
    if (block.type === "heading") {
      return `# ${block.text}`;
    }
    if (block.type === "quote") {
      return `> ${block.text}${block.author ? ` — ${block.author}` : ""}`;
    }
    if (block.type === "list") {
      return block.items.map((item: string) => `- ${item}`).join("\n");
    }
    if (block.type === "banner") {
      return "[[banner]]";
    }
    if (block.type === "paragraph") {
      return block.text;
    }
    return "";
  }).join("\n\n");
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
  popular: false,
};

type ArticleSummary = {
  slug: string;
  title: string;
  categoryId: string;
  publishedAt: string;
  readTime?: string;
  popular?: boolean;
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
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const categoryOptions = useMemo(() => categories, []);
  
  // Определяем, к какому бэкенду подключены
  const apiBaseUrl = useMemo(() => {
    if (typeof window !== "undefined") {
      return getApiBaseUrl();
    }
    return "";
  }, []);

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
        
        console.log("Loading articles from:", url);
        console.log("API Base URL:", apiBaseUrl);
        
        // Создаем AbortController для таймаута
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 секунд таймаут
        
        // Проверяем доступность бэкенда перед основным запросом
        if (!apiBaseUrl || apiBaseUrl === "") {
          // Локальный бэкенд - проверяем через прокси Next.js
          try {
            const healthController = new AbortController();
            const healthTimeoutId = setTimeout(() => healthController.abort(), 3000);
            
            const healthResponse = await fetch("/api/health", {
              method: "GET",
              signal: healthController.signal,
            });
            
            clearTimeout(healthTimeoutId);
            
            if (!healthResponse.ok) {
              console.warn("Local backend health check failed:", healthResponse.status);
              clearTimeout(timeoutId);
              setError(
                `Локальное приложение не отвечает (${healthResponse.status}). ` +
                `Убедитесь, что Next.js запущен командой 'npm run dev' в отдельном терминале.`
              );
              return;
            } else {
              console.log("Local backend is healthy");
            }
          } catch (healthErr) {
            console.warn("Local backend health check error:", healthErr);
            clearTimeout(timeoutId);
            const isAbortError = healthErr instanceof Error && healthErr.name === "AbortError";
            if (isAbortError || (healthErr instanceof Error && healthErr.message.includes("Failed to fetch"))) {
              setError(
                `Локальное приложение недоступно. ` +
                `Запустите Next.js командой 'npm run dev' в отдельном терминале. ` +
                `По умолчанию сервер слушает на порту 3000.`
              );
            } else {
              setError(
                `Ошибка подключения к локальному приложению: ${healthErr instanceof Error ? healthErr.message : String(healthErr)}. ` +
                `Убедитесь, что Next.js запущен на порту 3000.`
              );
            }
            return;
          }
        } else {
          // Продакшн или удаленный бэкенд - проверяем через /health
          try {
            const healthUrl = `${apiBaseUrl}/api/health`;
            console.log("Checking backend health at:", healthUrl);
            
            const healthController = new AbortController();
            const healthTimeoutId = setTimeout(() => healthController.abort(), 5000);
            
            const healthResponse = await fetch(healthUrl, {
              method: "GET",
              signal: healthController.signal,
            });
            
            clearTimeout(healthTimeoutId);
            
            if (!healthResponse.ok) {
              console.warn("Backend health check failed:", healthResponse.status);
            } else {
              console.log("Backend is healthy");
            }
          } catch (healthErr) {
            console.warn("Backend health check error:", healthErr);
            // Не блокируем основной запрос, если health check не прошел
            // Просто логируем предупреждение
          }
        }
        
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        // Проверяем, что ответ действительно JSON, а не HTML (404 от Next.js)
        const contentType = response.headers.get("content-type");
        if (contentType && !contentType.includes("application/json")) {
          const errorText = await response.text();
          console.error("Received non-JSON response:", contentType, errorText.substring(0, 200));
          
          if (!apiBaseUrl || apiBaseUrl === "") {
            // Локальный бэкенд - вероятно не запущен
            setError(
              `Локальный API маршрут недоступен (${response.status}). ` +
              `Запустите проект командой 'npm run dev' в отдельном терминале. ` +
              `Сервер должен слушать на порту 3000.`
            );
          } else {
            setError(
              `Получен неверный ответ от сервера (${response.status}). ` +
              `Проверьте URL: ${url}`
            );
          }
          return;
        }
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Failed to load articles:", response.status, errorText.substring(0, 200));
          setError(
            `Не удалось загрузить статьи (${response.status}). ` +
            `Проверьте подключение к API: ${apiBaseUrl || "локальный"}. ` +
            `Если используете удаленную среду, убедитесь, что выбранный порт открыт.`
          );
          return;
        }
        const data = await response.json();
        setArticles(data);
        setError(null); // Очищаем ошибку при успешной загрузке
      } catch (err) {
        console.error("Error loading articles:", err);
        const apiBaseUrl = getApiBaseUrl();
        const errorMessage = err instanceof Error ? err.message : String(err);
        const isAbortError = err instanceof Error && err.name === "AbortError";
        
        if (isAbortError || errorMessage.includes("timeout") || errorMessage.includes("Failed to fetch")) {
          setError(
            `Таймаут подключения к API: ${apiBaseUrl || "локальный"}. ` +
            `Проверьте, что приложение запущено и нужный порт (по умолчанию 3000) доступен извне. ` +
            `Если используете удаленный бэкенд, убедитесь, что порт открыт в файрволе.`
          );
        } else {
          setError(
            `Не удалось загрузить статьи: ${errorMessage}. ` +
            `Бэкенд: ${apiBaseUrl || "локальный"}. ` +
            `Проверьте, что бэкенд запущен и доступен.`
          );
        }
      }
    };

    loadArticles();
  }, [isAuthenticated]);

  const handleEditArticle = async (slug: string) => {
    try {
      const apiBaseUrl = getApiBaseUrl();
      const url = apiBaseUrl ? `${apiBaseUrl}/api/articles/${slug}` : `/api/articles/${slug}`;
      const response = await fetch(url);
      
      if (response.ok) {
        const article = await response.json();
        
        // Обрабатываем content: может быть строкой JSON или уже объектом
        let contentData = null;
        if (article.content) {
          if (typeof article.content === 'string') {
            try {
              contentData = JSON.parse(article.content);
            } catch (e) {
              console.error('Failed to parse content as JSON:', e);
              contentData = null;
            }
          } else if (typeof article.content === 'object') {
            // Уже объект (MySQL JSON колонка возвращается как объект)
            contentData = article.content;
          }
        }
        
        setForm({
          title: article.title || "",
          slug: article.slug || "",
          excerpt: article.excerpt || "",
          categoryId: article.categoryId || (categories[0]?.id ?? "digital-nomad"),
          heroImage: article.heroImage || "",
          authorName: article.authorName || "",
          readTime: article.readTime || "5 min read",
          publishedAt: article.publishedAt ? new Date(article.publishedAt).toISOString().split('T')[0] : "",
          contentRaw: contentData ? formatContentRaw(contentData) : "",
          popular: article.popular === true || article.popular === 1,
        });
        // Прокручиваем к форме
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setError("Не удалось загрузить статью для редактирования.");
      }
    } catch (err) {
      console.error(err);
      setError("Не удалось загрузить статью для редактирования.");
    }
  };

  const handleChange = (field: keyof typeof form) => (value: string | boolean) => {
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
        popular: form.popular || false,
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

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);
    
    try {
      const apiBaseUrl = getApiBaseUrl();
      const url = apiBaseUrl ? `${apiBaseUrl}/api/upload` : "/api/upload";
      
      const formData = new FormData();
      formData.append("image", file);
      
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Ошибка загрузки" }));
        const errorMessage = errorData.message || "Ошибка при загрузке изображения";
        console.error("Error uploading image:", errorMessage);
        setError(errorMessage);
        setIsUploading(false);
        return;
      }
      
      const data = await response.json();
      // Сохраняем относительный путь для загруженных изображений
      // Это позволит Next.js правильно обработать их
      const imageUrl = data.url; // data.url уже содержит относительный путь /uploads/...
      
      handleChange("heroImage")(imageUrl);
      setMessage("Изображение успешно загружено");
    } catch (err) {
      console.error("Error uploading image:", err);
      setError(err instanceof Error ? err.message : "Не удалось загрузить изображение");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        handleImageUpload(file);
      } else {
        setError("Пожалуйста, загрузите изображение");
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageUpload(e.target.files[0]);
    }
  };

  const handleDeleteArticle = async (slug: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Предотвращаем срабатывание onClick на строке
    
    if (!confirm(`Вы уверены, что хотите удалить статью "${slug}"? Это действие нельзя отменить.`)) {
      return;
    }

    try {
      const apiBaseUrl = getApiBaseUrl();
      const url = apiBaseUrl ? `${apiBaseUrl}/api/articles/${slug}` : `/api/articles/${slug}`;
      
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Ошибка удаления" }));
        const errorMessage = errorData.message || "Ошибка при удалении статьи";
        console.error("Error deleting article:", errorMessage);
        setError(errorMessage);
        return;
      }

      setMessage(`Статья "${slug}" успешно удалена`);
      setError(null);

      const refreshUrl = apiBaseUrl ? `${apiBaseUrl}/api/articles` : "/api/articles";
      const updatedArticles = await fetch(refreshUrl).then((res) => res.json());
      setArticles(updatedArticles);
    } catch (err) {
      console.error("Error deleting article:", err);
      setError(err instanceof Error ? err.message : "Не удалось удалить статью");
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
                    <div className="flex items-center gap-3">
                      <h1 className="font-playfair text-[40px] font-normal leading-[110%] text-[#333333]">
                        Admin — создание статьи
                      </h1>
                      {apiBaseUrl && (
                        <span className="rounded-full bg-[#ecf8f4] px-3 py-1 font-open-sans text-xs font-medium text-[#114b5f]">
                          {apiBaseUrl.includes("pathvoyager.com") ? "Продакшн бэкенд" : "Локальный бэкенд"}
                        </span>
                      )}
                      {!apiBaseUrl && (
                        <span className="rounded-full bg-[#ecf8f4] px-3 py-1 font-open-sans text-xs font-medium text-[#114b5f]">
                          Локальный бэкенд
                        </span>
                      )}
                    </div>
                    <p className="font-open-sans text-base leading-[1.6] text-[#767676]">
                      Используйте форму ниже, чтобы подготовить материал для PathVoyager. Контент можно описывать в формате Markdown:
                      <br />
                      <code>#</code> — заголовок, <code>-</code> — элементы списка, <code>&gt;</code> — цитата, <code>[[banner]]</code> — место для баннера внутри текста.
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
                  <label className="flex flex-row items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.popular}
                      onChange={(event) => handleChange("popular")(event.target.checked)}
                      className="w-5 h-5 rounded border-[#d6d6d6] text-[#114b5f] focus:ring-2 focus:ring-[#114b5f] cursor-pointer"
                    />
                    <span className="font-open-sans text-sm uppercase tracking-[0.08em] text-[#767676]">
                      Popular article
                    </span>
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

                <div className="flex flex-col gap-2">
                  <span className="font-open-sans text-sm uppercase tracking-[0.08em] text-[#767676]">
                    Обложка
                  </span>
                  
                  {/* Drag and Drop зона */}
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
                      dragActive
                        ? "border-[#114b5f] bg-[#f0f8fa]"
                        : "border-[#d6d6d6] bg-white hover:border-[#114b5f]"
                    } ${isUploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileInput}
                      disabled={isUploading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center gap-3 px-6 py-8 text-center">
                      {form.heroImage ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={form.heroImage}
                            alt="Preview"
                            className="max-h-48 max-w-full rounded-lg object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                          <p className="font-open-sans text-sm text-[#767676]">
                            Нажмите или перетащите изображение для замены
                          </p>
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-12 h-12 text-[#767676]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <div className="flex flex-col gap-1">
                            <p className="font-open-sans text-sm font-medium text-[#333333]">
                              Нажмите или перетащите изображение сюда
                            </p>
                            <p className="font-open-sans text-xs text-[#767676]">
                              Поддерживаются форматы: JPG, PNG, WEBP (макс. 10MB)
                            </p>
                          </div>
                        </>
                      )}
                      {isUploading && (
                        <p className="font-open-sans text-sm text-[#114b5f]">Загрузка...</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Поле для ввода URL вручную */}
                  <div className="mt-2">
                    <label className="font-open-sans text-xs uppercase tracking-[0.08em] text-[#767676] mb-1 block">
                      Или введите URL изображения
                    </label>
                    <input
                      type="text"
                      value={form.heroImage}
                      onChange={(event) => handleChange("heroImage")(event.target.value)}
                      className="w-full rounded-lg border border-[#d6d6d6] px-4 py-2 font-open-sans text-base focus:border-[#114b5f] focus:outline-none"
                      placeholder="https://..."
                    />
                  </div>
                </div>

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
                        <th className="px-4 py-3 text-left font-open-sans text-sm font-semibold uppercase tracking-[0.06em] text-[#767676]">
                          Popular
                        </th>
                        <th className="px-4 py-3 text-left font-open-sans text-sm font-semibold uppercase tracking-[0.06em] text-[#767676]">
                          Действия
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0f0f0]">
                      {articles.map((article) => (
                        <tr 
                          key={article.slug} 
                          className="hover:bg-[#fafafa] cursor-pointer"
                          onClick={() => handleEditArticle(article.slug)}
                        >
                          <td className="px-4 py-3 font-open-sans text-sm text-[#114b5f]">
                            <a
                              href={`/posts/${article.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="underline hover:no-underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {article.slug}
                            </a>
                          </td>
                          <td className="px-4 py-3 font-open-sans text-sm text-[#333333]">{article.title}</td>
                          <td className="px-4 py-3 font-open-sans text-sm text-[#767676]">{article.categoryId}</td>
                          <td className="px-4 py-3 font-open-sans text-sm text-[#767676]">
                            {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : "—"}
                          </td>
                          <td className="px-4 py-3 font-open-sans text-sm text-[#767676]">
                            {article.popular ? "✓" : "—"}
                          </td>
                          <td className="px-4 py-3 font-open-sans text-sm text-[#767676]">
                            <button
                              onClick={(e) => handleDeleteArticle(article.slug, e)}
                              className="rounded-lg border border-[#cc2a2a] px-3 py-1 font-open-sans text-xs font-medium text-[#cc2a2a] transition hover:bg-[#cc2a2a] hover:text-white cursor-pointer"
                              title="Удалить статью"
                            >
                              Удалить
                            </button>
                          </td>
                        </tr>
                      ))}
                      {articles.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-4 py-6 text-center font-open-sans text-sm text-[#767676]">
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
