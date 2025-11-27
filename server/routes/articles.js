const express = require("express");
const { getPool } = require("../db");

const router = express.Router();

// Проверка доступности БД
const getPoolSafe = () => {
  try {
    return getPool();
  } catch (error) {
    return null;
  }
};

router.get("/", async (_req, res) => {
  try {
    const pool = getPoolSafe();
    if (!pool) {
      // В development без БД возвращаем пустой массив
      console.log("Database pool not available, returning empty array");
      res.json([]);
      return;
    }
    const [rows] = await pool.query(
      `SELECT slug, title, excerpt, hero_image AS heroImage, category_id AS categoryId, author_name AS authorName, read_time AS readTime, published_at AS publishedAt, popular FROM articles ORDER BY published_at DESC`,
    );
    res.json(rows);
  } catch (error) {
    console.error("Failed to fetch articles", error);
    // Возвращаем пустой массив вместо ошибки, чтобы фронтенд не падал
    res.status(200).json([]);
  }
});

router.get("/:slug", async (req, res) => {
  const { slug } = req.params;
  try {
    const pool = getPoolSafe();
    if (!pool) {
      res.status(404).json({ message: "Article not found" });
      return;
    }
    const [rows] = await pool.query(
      `SELECT slug, title, excerpt, hero_image AS heroImage, category_id AS categoryId, author_name AS authorName, read_time AS readTime, published_at AS publishedAt, content, popular FROM articles WHERE slug = ? LIMIT 1`,
      [slug],
    );

    if (rows.length === 0) {
      res.status(404).json({ message: "Article not found" });
      return;
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Failed to fetch article", error);
    res.status(500).json({ message: "Failed to fetch article" });
  }
});

router.post("/", async (req, res) => {
  console.log("POST /api/articles - Request received");
  console.log("Body keys:", Object.keys(req.body));
  console.log("Content type:", req.headers["content-type"]);
  
  const {
    slug,
    title,
    excerpt,
    heroImage,
    categoryId,
    authorName,
    readTime,
    publishedAt,
    content,
    popular,
  } = req.body;

  // Валидация обязательных полей
  if (!slug || !title || !categoryId) {
    console.log("Validation failed - missing required fields:", { slug: !!slug, title: !!title, categoryId: !!categoryId });
    res.status(400).json({ message: "slug, title, and categoryId are required" });
    return;
  }

  // Проверяем content - может быть массивом или уже строкой JSON
  let contentToSave = content;
  if (!contentToSave) {
    console.log("Validation failed - content is required");
    res.status(400).json({ message: "content is required" });
    return;
  }

  // Если content уже строка, пытаемся распарсить
  if (typeof contentToSave === "string") {
    try {
      contentToSave = JSON.parse(contentToSave);
    } catch (e) {
      console.error("Failed to parse content as JSON:", e);
      res.status(400).json({ message: "content must be a valid JSON array" });
      return;
    }
  }

  // Проверяем, что content - массив
  if (!Array.isArray(contentToSave)) {
    console.log("Validation failed - content must be an array");
    res.status(400).json({ message: "content must be an array" });
    return;
  }

  try {
    const pool = getPoolSafe();
    if (!pool) {
      console.log("Database pool not available");
      res.status(503).json({ message: "Database not available" });
      return;
    }
    console.log("Attempting to save article to database...");
    
    // Преобразуем дату в формат MySQL (YYYY-MM-DD HH:MM:SS)
    let mysqlDate = null;
    if (publishedAt) {
      try {
        const date = new Date(publishedAt);
        if (!isNaN(date.getTime())) {
          // Форматируем дату для MySQL: YYYY-MM-DD HH:MM:SS
          mysqlDate = date.toISOString().slice(0, 19).replace('T', ' ');
        }
      } catch (error) {
        console.error("Error parsing date:", error);
        mysqlDate = null;
      }
    }
    
    // Преобразуем content в JSON строку
    const contentJson = JSON.stringify(contentToSave);
    console.log("Content length:", contentJson.length);
    
    const [result] = await pool.query(
      `INSERT INTO articles (slug, title, excerpt, hero_image, category_id, author_name, read_time, published_at, content, popular)
       VALUES (?, ?, ?, ?, ?, ?, ?, COALESCE(?, NOW()), ?, ?)
       ON DUPLICATE KEY UPDATE
         title = VALUES(title),
         excerpt = VALUES(excerpt),
         hero_image = VALUES(hero_image),
         category_id = VALUES(category_id),
         author_name = VALUES(author_name),
         read_time = VALUES(read_time),
         published_at = VALUES(published_at),
         content = VALUES(content),
         popular = VALUES(popular)`,
      [
        slug,
        title,
        excerpt ?? null,
        heroImage ?? null,
        categoryId,
        authorName ?? null,
        readTime ?? null,
        mysqlDate,
        contentJson,
        popular === true || popular === 1 ? 1 : 0,
      ],
    );

    console.log("Article saved successfully:", slug);
    res.status(201).json({ slug });
  } catch (error) {
    console.error("Failed to save article", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage,
    });
    
    // Возвращаем более детальное сообщение об ошибке
    const errorMessage = error.message || "Failed to save article";
    const errorCode = error.code || "UNKNOWN";
    
    res.status(500).json({ 
      message: errorMessage,
      code: errorCode,
      // В проде не показываем stack trace, но показываем код ошибки
      ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
    });
  }
});

router.delete("/:slug", async (req, res) => {
  const { slug } = req.params;
  console.log("DELETE /api/articles/:slug - Request received for slug:", slug);
  
  try {
    const pool = getPoolSafe();
    if (!pool) {
      console.log("Database pool not available");
      res.status(503).json({ message: "Database not available" });
      return;
    }
    
    // Проверяем, существует ли статья
    const [existing] = await pool.query(
      `SELECT id FROM articles WHERE slug = ? LIMIT 1`,
      [slug],
    );
    
    if (existing.length === 0) {
      res.status(404).json({ message: "Article not found" });
      return;
    }
    
    // Удаляем статью
    await pool.query(
      `DELETE FROM articles WHERE slug = ?`,
      [slug],
    );
    
    console.log("Article deleted successfully:", slug);
    res.status(200).json({ message: "Article deleted successfully", slug });
  } catch (error) {
    console.error("Failed to delete article", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage,
    });
    
    const errorMessage = error.message || "Failed to delete article";
    const errorCode = error.code || "UNKNOWN";
    
    res.status(500).json({ 
      message: errorMessage,
      code: errorCode,
      ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
    });
  }
});

module.exports = router;
