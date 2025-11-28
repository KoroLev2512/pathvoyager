import { NextRequest, NextResponse } from "next/server";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { getDbPoolSafe } from "@/server/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteParams = {
  params: { slug: string };
};

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { slug } = params;
  try {
    const pool = await getDbPoolSafe();
    if (!pool) {
      return NextResponse.json({ message: "Article not found" }, { status: 404 });
    }

    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT slug, title, excerpt, hero_image AS heroImage, category_id AS categoryId, author_name AS authorName, read_time AS readTime, published_at AS publishedAt, content, popular FROM articles WHERE slug = ? LIMIT 1`,
      [slug],
    );

    if (rows.length === 0) {
      return NextResponse.json({ message: "Article not found" }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Failed to fetch article", error);
    return NextResponse.json({ message: "Failed to fetch article" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { slug } = params;
  try {
    const pool = await getDbPoolSafe();
    if (!pool) {
      return NextResponse.json({ message: "Database not available" }, { status: 503 });
    }

    const [existing] = await pool.query<RowDataPacket[]>(
      `SELECT id FROM articles WHERE slug = ? LIMIT 1`,
      [slug],
    );

    if (existing.length === 0) {
      return NextResponse.json({ message: "Article not found" }, { status: 404 });
    }

    await pool.query<ResultSetHeader>(
      `DELETE FROM articles WHERE slug = ?`,
      [slug],
    );

    return NextResponse.json({ message: "Article deleted successfully", slug });
  } catch (error) {
    console.error("Failed to delete article", error);
    const message = error instanceof Error ? error.message : "Failed to delete article";
    return NextResponse.json({ message }, { status: 500 });
  }
}


