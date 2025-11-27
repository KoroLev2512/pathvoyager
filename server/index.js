require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { initialise } = require("./db");
const articlesRouter = require("./routes/articles");
const uploadRouter = require("./routes/upload");

const app = express();
const PORT = process.env.PORT || 4000;
const SOCKET_PATH = process.env.SOCKET_PATH;

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
  : [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://localhost:3001",
      "http://127.0.0.1:3001",
      "https://pathvoyager.com",
      "https://www.pathvoyager.com",
      "http://pathvoyager.com",
      "http://www.pathvoyager.com",
    ];

app.use(cors({ 
  origin: (origin, callback) => {
    // Разрешаем запросы без origin (например, из Postman) или из разрешенных источников
    if (!origin) {
      callback(null, true);
      return;
    }
    
    // Разрешаем все localhost порты для разработки
    if (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) {
      callback(null, true);
      return;
    }
    
    // Проверяем список разрешенных источников
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    
    console.warn("CORS blocked origin:", origin);
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json({ limit: "10mb" })); // Увеличиваем лимит для больших статей

// Раздача статических файлов из папки uploads
const getUploadsPath = () => {
  // Если установлена переменная окружения, используем её
  if (process.env.UPLOADS_DIR) {
    return process.env.UPLOADS_DIR;
  }
  // Иначе используем public/uploads относительно текущей директории
  return path.join(process.cwd(), "public", "uploads");
};

const uploadsPath = getUploadsPath();
if (fs.existsSync(uploadsPath)) {
  // Используем express.static с правильными опциями для раздачи файлов
  app.use("/uploads", express.static(uploadsPath, {
    maxAge: '1y', // Кэширование на 1 год
    etag: true,
    lastModified: true,
    setHeaders: (res, filePath) => {
      // Устанавливаем правильные заголовки для изображений
      const ext = path.extname(filePath).toLowerCase();
      const contentTypeMap = {
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml',
      };
      if (contentTypeMap[ext]) {
        res.setHeader('Content-Type', contentTypeMap[ext]);
      }
    }
  }));
  console.log("Static files from uploads directory are served at /uploads");
  console.log("Uploads path:", uploadsPath);
} else {
  console.warn("Uploads directory does not exist:", uploadsPath);
  // Создаем директорию, если её нет
  try {
    fs.mkdirSync(uploadsPath, { recursive: true });
    console.log("Created uploads directory:", uploadsPath);
    app.use("/uploads", express.static(uploadsPath));
  } catch (err) {
    console.error("Failed to create uploads directory:", err);
  }
}

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/articles", articlesRouter);
app.use("/api/upload", uploadRouter);

// Определяем development режим:
// - Если есть SOCKET_PATH - это продакшен
// - Если нет SOCKET_PATH - это development (локальная разработка)
// - Игнорируем NODE_ENV из .env, так как он может быть установлен для других целей
const isDevelopment = !process.env.SOCKET_PATH;

console.log("Environment check:", { 
  SOCKET_PATH: process.env.SOCKET_PATH, 
  PORT: PORT,
  isDevelopment: isDevelopment 
});

initialise()
  .then(() => {
    if (SOCKET_PATH) {
      // Удаляем существующий socket файл, если он есть
      if (fs.existsSync(SOCKET_PATH)) {
        fs.unlinkSync(SOCKET_PATH);
      }
      
      // Создаем директорию для socket, если её нет
      const socketDir = path.dirname(SOCKET_PATH);
      if (!fs.existsSync(socketDir)) {
        fs.mkdirSync(socketDir, { recursive: true });
      }

      // В проде слушаем и на socket (для Nginx), и на порту (для внешних подключений)
      app.listen(SOCKET_PATH, (err) => {
        if (err) {
          console.error(`Failed to listen on socket ${SOCKET_PATH}:`, err.message);
          process.exit(1);
          return;
        }
        // Устанавливаем права доступа на socket файл
        fs.chmodSync(SOCKET_PATH, 0o666);
        console.log(`Express server listening on socket ${SOCKET_PATH}`);
      });
      
      // Также слушаем на порту для внешних подключений (например, с локальной машины)
      app.listen(PORT, "0.0.0.0", (err) => {
        if (err) {
          console.error(`Failed to listen on port ${PORT}:`, err.message);
          if (err.code === 'EADDRINUSE') {
            console.error(`Порт ${PORT} уже занят. Остановите другой процесс или используйте другой порт.`);
            console.error(`Для поиска процесса используйте: lsof -ti:${PORT}`);
          }
          // В проде не завершаем процесс, если socket работает
          return;
        }
        console.log(`Express server also listening on port ${PORT} for external connections`);
      });
    } else {
      app.listen(PORT, () => {
        console.log(`Express server listening on port ${PORT}`);
      });
    }
  })
  .catch((error) => {
    // Логируем ошибку для отладки
    console.log("Error caught:", {
      code: error.code,
      errno: error.errno,
      message: error.message,
      isDevelopment: isDevelopment
    });
    
    // В development запускаем сервер даже при ошибках БД
    if (isDevelopment && (error.code === "ECONNREFUSED" || error.code === "ER_ACCESS_DENIED_ERROR" || error.errno === 1045)) {
      if (error.code === "ECONNREFUSED") {
        console.warn("⚠️  MySQL не доступен. Сервер запущен в режиме без БД.");
        console.warn("   Для работы с данными установите MySQL или используйте Docker.");
      } else if (error.code === "ER_ACCESS_DENIED_ERROR") {
        console.warn("⚠️  Ошибка доступа к MySQL. Проверьте учетные данные в .env файле.");
        console.warn("   Сервер запущен в режиме без БД.");
        console.warn("   Для настройки MySQL создайте пользователя и базу данных:");
        console.warn("   CREATE DATABASE pathvoyager;");
        console.warn("   CREATE USER 'admin'@'localhost' IDENTIFIED BY 'aboba-2512';");
        console.warn("   GRANT ALL PRIVILEGES ON pathvoyager.* TO 'admin'@'localhost';");
        console.warn("   FLUSH PRIVILEGES;");
      }
      console.warn("   API будет возвращать пустые данные.");
      
      // Запускаем сервер даже без БД в development
      if (SOCKET_PATH) {
        if (fs.existsSync(SOCKET_PATH)) {
          fs.unlinkSync(SOCKET_PATH);
        }
        const socketDir = path.dirname(SOCKET_PATH);
        if (!fs.existsSync(socketDir)) {
          fs.mkdirSync(socketDir, { recursive: true });
        }
        app.listen(SOCKET_PATH, () => {
          fs.chmodSync(SOCKET_PATH, 0o666);
          console.log(`Express server listening on socket ${SOCKET_PATH} (без БД)`);
        });
        // Также слушаем на порту для внешних подключений
        app.listen(PORT, "0.0.0.0", (err) => {
          if (err) {
            console.error(`Failed to listen on port ${PORT}:`, err.message);
            return;
          }
          console.log(`Express server also listening on port ${PORT} for external connections (без БД)`);
        });
      } else {
        app.listen(PORT, (err) => {
          if (err) {
            console.error(`Failed to listen on port ${PORT}:`, err.message);
            if (err.code === 'EADDRINUSE') {
              console.error(`Порт ${PORT} уже занят. Остановите другой процесс или используйте другой порт.`);
              console.error(`Для поиска процесса используйте: lsof -ti:${PORT}`);
            }
            process.exit(1);
            return;
          }
          console.log(`Express server listening on port ${PORT} (без БД)`);
        });
      }
    } else {
      console.error("Failed to initialise database", error);
      process.exit(1);
    }
  });
