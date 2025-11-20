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
      `SELECT slug, title, excerpt, hero_image AS heroImage, category_id AS categoryId, author_name AS authorName, read_time AS readTime, published_at AS publishedAt FROM articles ORDER BY published_at DESC`,
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
      `SELECT slug, title, excerpt, hero_image AS heroImage, category_id AS categoryId, author_name AS authorName, read_time AS readTime, published_at AS publishedAt, content FROM articles WHERE slug = ? LIMIT 1`,
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
  console.log("Body:", JSON.stringify(req.body, null, 2));
  
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
  } = req.body;

  if (!slug || !title || !categoryId || !content) {
    console.log("Validation failed - missing required fields");
    res.status(400).json({ message: "slug, title, categoryId and content are required" });
    return;
  }

  try {
    const pool = getPoolSafe();
    if (!pool) {
      console.log("Database pool not available");
      res.status(503).json({ message: "Database not available. Please install MySQL for development." });
      return;
    }
    console.log("Attempting to save article to database...");
    
    // Преобразуем дату в формат MySQL (YYYY-MM-DD HH:MM:SS)
    let mysqlDate = null;
    if (publishedAt) {
      try {
        const date = new Date(publishedAt);
        // Форматируем дату для MySQL: YYYY-MM-DD HH:MM:SS
        mysqlDate = date.toISOString().slice(0, 19).replace('T', ' ');
      } catch (error) {
        console.error("Error parsing date:", error);
        mysqlDate = null;
      }
    }
    
    const [result] = await pool.query(
      `INSERT INTO articles (slug, title, excerpt, hero_image, category_id, author_name, read_time, published_at, content)
       VALUES (?, ?, ?, ?, ?, ?, ?, COALESCE(?, NOW()), ?)
       ON DUPLICATE KEY UPDATE
         title = VALUES(title),
         excerpt = VALUES(excerpt),
         hero_image = VALUES(hero_image),
         category_id = VALUES(category_id),
         author_name = VALUES(author_name),
         read_time = VALUES(read_time),
         published_at = VALUES(published_at),
         content = VALUES(content)`,
      [
        slug,
        title,
        excerpt ?? null,
        heroImage ?? null,
        categoryId,
        authorName ?? null,
        readTime ?? null,
        mysqlDate,
        JSON.stringify(content),
      ],
    );

    res.status(201).json({ slug });
  } catch (error) {
    console.error("Failed to save article", error);
    // Возвращаем более детальное сообщение об ошибке
    const errorMessage = error.message || "Failed to save article";
    res.status(500).json({ 
      message: errorMessage,
      error: process.env.NODE_ENV === "development" ? error.stack : undefined
    });
  }
});

module.exports = router;
