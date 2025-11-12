const express = require("express");
const { getPool } = require("../db");

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const pool = getPool();
    const result = await pool.query(
      `SELECT slug, title, excerpt, hero_image AS "heroImage", category_id AS "categoryId", author_name AS "authorName", read_time AS "readTime", published_at AS "publishedAt" FROM articles ORDER BY published_at DESC`,
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Failed to fetch articles", error);
    res.status(500).json({ message: "Failed to fetch articles" });
  }
});

router.get("/:slug", async (req, res) => {
  const { slug } = req.params;
  try {
    const pool = getPool();
    const result = await pool.query(
      `SELECT slug, title, excerpt, hero_image AS "heroImage", category_id AS "categoryId", author_name AS "authorName", read_time AS "readTime", published_at AS "publishedAt", content FROM articles WHERE slug = $1 LIMIT 1`,
      [slug],
    );

    if (result.rowCount === 0) {
      res.status(404).json({ message: "Article not found" });
      return;
    }

    res.json(result.rows[0]);
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
    const result = await pool.query(
      `INSERT INTO articles (slug, title, excerpt, hero_image, category_id, author_name, read_time, published_at, content)
       VALUES ($1, $2, $3, $4, $5, $6, $7, COALESCE($8, NOW()), $9)
       ON CONFLICT (slug) DO UPDATE SET
         title = EXCLUDED.title,
         excerpt = EXCLUDED.excerpt,
         hero_image = EXCLUDED.hero_image,
         category_id = EXCLUDED.category_id,
         author_name = EXCLUDED.author_name,
         read_time = EXCLUDED.read_time,
         published_at = EXCLUDED.published_at,
         content = EXCLUDED.content
       RETURNING slug` ,
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

    res.status(201).json({ slug: result.rows[0].slug });
  } catch (error) {
    console.error("Failed to save article", error);
    res.status(500).json({ message: "Failed to save article" });
  }
});

module.exports = router;
