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
    res.status(400).json({ message: "slug, title, categoryId and content are required" });
    return;
  }

  try {
    const pool = getPoolSafe();
    if (!pool) {
      res.status(503).json({ message: "Database not available. Please install MySQL for development." });
      return;
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
        publishedAt ?? null,
        JSON.stringify(content),
      ],
    );

    res.status(201).json({ slug });
  } catch (error) {
    console.error("Failed to save article", error);
    res.status(500).json({ message: "Failed to save article" });
  }
});

module.exports = router;
