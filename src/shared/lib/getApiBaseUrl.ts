// src/shared/lib/getApiBaseUrl.ts

export const getApiBaseUrl = (): string => {
  const nodeEnv = process.env.NODE_ENV;

  // В development всегда ходим на тот же origin через относительные пути
  if (nodeEnv !== "production") {
    return "";
  }

  // В production можно переопределить базовый URL
  const envApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (envApiUrl) {
    if (envApiUrl.toLowerCase() === "local") {
      // Специальное значение для использования относительных путей даже в проде
      return "";
    }
    return envApiUrl;
  }

  // Fallback: основной боевой домен
  return "https://pathvoyager.com";
};
