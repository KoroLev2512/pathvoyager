require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { initialise } = require("./db");
const articlesRouter = require("./routes/articles");

const app = express();
const PORT = process.env.PORT || 4000;
const SOCKET_PATH = process.env.SOCKET_PATH;

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
  : ["http://localhost:3000", "http://127.0.0.1:3000", "https://pathvoyager.com", "https://www.pathvoyager.com"];

app.use(cors({ 
  origin: (origin, callback) => {
    // Разрешаем запросы без origin (например, из Postman) или из разрешенных источников
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true 
}));
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/articles", articlesRouter);

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

      app.listen(SOCKET_PATH, () => {
        // Устанавливаем права доступа на socket файл
        fs.chmodSync(SOCKET_PATH, 0o666);
        console.log(`Express server listening on socket ${SOCKET_PATH}`);
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
      } else {
        app.listen(PORT, () => {
          console.log(`Express server listening on port ${PORT} (без БД)`);
        });
      }
    } else {
      console.error("Failed to initialise database", error);
      process.exit(1);
    }
  });
