const express = require("express");
const { getPool } = require("../db");

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query(
      `SELECT slug, title, excerpt, hero_image AS heroImage, category_id AS categoryId, author_name AS authorName, read_time AS readTime, published_at AS publishedAt FROM articles ORDER BY published_at DESC`,
    );
    res.json(rows);
  } catch (error) {
    console.error("Failed to fetch articles", error);
    res.status(500).json({ message: "Failed to fetch articles" });
  }
});

router.get("/:slug", async (req, res) => {
  const { slug } = req.params;
  try {
    const pool = getPool();
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
    const pool = getPool();
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
