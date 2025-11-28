import { NextRequest, NextResponse } from "next/server";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { getDbPoolSafe } from "@/server/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const pool = await getDbPoolSafe();
    if (!pool) {
      console.log("Database pool not available, returning empty array");
      return NextResponse.json([]);
    }

    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT slug, title, excerpt, hero_image AS heroImage, category_id AS categoryId, author_name AS authorName, read_time AS readTime, published_at AS publishedAt, popular FROM articles ORDER BY published_at DESC`,
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Failed to fetch articles", error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
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
    } = body;

    if (!slug || !title || !categoryId) {
      return NextResponse.json({ message: "slug, title, and categoryId are required" }, { status: 400 });
    }

    let contentToSave = content;
    if (!contentToSave) {
      return NextResponse.json({ message: "content is required" }, { status: 400 });
    }

    if (typeof contentToSave === "string") {
      try {
        contentToSave = JSON.parse(contentToSave);
      } catch (error) {
        console.error("Failed to parse content as JSON:", error);
        return NextResponse.json({ message: "content must be a valid JSON array" }, { status: 400 });
      }
    }

    if (!Array.isArray(contentToSave)) {
      return NextResponse.json({ message: "content must be an array" }, { status: 400 });
    }

    const pool = await getDbPoolSafe();
    if (!pool) {
      return NextResponse.json({ message: "Database not available" }, { status: 503 });
    }

    let mysqlDate: string | null = null;
    if (publishedAt) {
      const date = new Date(publishedAt);
      if (!Number.isNaN(date.getTime())) {
        mysqlDate = date.toISOString().slice(0, 19).replace("T", " ");
      }
    }

    const contentJson = JSON.stringify(contentToSave);

    await pool.query<ResultSetHeader>(
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

    return NextResponse.json({ slug }, { status: 201 });
  } catch (error) {
    console.error("Failed to save article", error);
    const message = error instanceof Error ? error.message : "Failed to save article";
    return NextResponse.json({ message }, { status: 500 });
  }
}


