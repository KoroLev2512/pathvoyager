const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Создаем директорию для загрузок
// В проде используем абсолютный путь для лучшей совместимости
const getUploadsDir = () => {
  // Если установлена переменная окружения, используем её
  if (process.env.UPLOADS_DIR) {
    return process.env.UPLOADS_DIR;
  }
  // Иначе используем public/uploads относительно текущей директории
  return path.join(process.cwd(), "public", "uploads");
};

const uploadsDir = getUploadsDir();
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("Created uploads directory:", uploadsDir);
}
console.log("Uploads directory:", uploadsDir);

// Настройка multer для сохранения файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Генерируем уникальное имя файла: timestamp-originalname
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, "-");
    cb(null, `${uniqueSuffix}-${name}${ext}`);
  },
});

// Фильтр для проверки типа файла
const fileFilter = (req, file, cb) => {
  // Разрешаем только изображения
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Разрешены только изображения"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: fileFilter,
});

router.post("/", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Файл не был загружен" });
    }

    // Логируем информацию о сохраненном файле для отладки
    console.log("File uploaded successfully:", {
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size,
      uploadsDir: uploadsDir,
      processCwd: process.cwd(),
      uploadsDirEnv: process.env.UPLOADS_DIR,
    });

    // Возвращаем URL загруженного файла
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
      url: fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      path: req.file.path, // Добавляем путь для отладки (можно убрать в продакшене)
    });
  } catch (error) {
    console.error("Failed to upload file", error);
    res.status(500).json({ message: "Ошибка при загрузке файла" });
  }
});

module.exports = router;

