// src/shared/lib/getApiBaseUrl.ts

export const getApiBaseUrl = (): string => {
  // 1. Приоритет у переменной окружения
  // Она позволяет гибко настраивать бэкенд как для локальной разработки, так и для прода
  const envApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (envApiUrl) {
    // Если переменная установлена в 'local', используем относительный путь
    if (envApiUrl.toLowerCase() === 'local') {
      return '';
    }
    return envApiUrl;
  }

  // 2. Определение окружения (клиент или сервер)
  const isServer = typeof window === 'undefined';

  // 3. Логика для локальной разработки (если переменная окружения не задана)
  if (process.env.NODE_ENV !== 'production') {
    // На сервере в development всегда используем относительные пути для прокси
    if (isServer) {
      return '';
    }
    // На клиенте в development проверяем hostname
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return ''; // Относительный путь, будет проксирован через Next.js rewrites
    }
  }

  // 4. Fallback для продакшена (если переменная не задана)
  return 'https://pathvoyager.com';
};
