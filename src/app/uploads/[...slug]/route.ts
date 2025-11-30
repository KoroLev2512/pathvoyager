import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getUploadsDir } from "@/server/uploads";
import { lookup } from "mime-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string[] }> }
) {
  try {
    const resolvedParams = await context.params;
    const { slug } = resolvedParams;

    if (!slug || slug.length === 0) {
      return new NextResponse("File not found", { status: 404 });
    }

    const filename = slug.join("/");
    const uploadsDir = getUploadsDir();
    const filePath = path.join(uploadsDir, filename);

    // Basic security: prevent path traversal attacks
    // Ensure the resolved path is still within the uploads directory
    if (!filePath.startsWith(uploadsDir)) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    if (!fs.existsSync(filePath)) {
      // For debugging purposes, log which file was not found and where it was looked for
      console.log(`[Uploads GET] File not found: ${filePath}`);
      return new NextResponse("File not found", { status: 404 });
    }

    const fileBuffer = await fs.promises.readFile(filePath);
    const mimeType = lookup(filename) || "application/octet-stream";

    const headers = new Headers();
    headers.set("Content-Type", mimeType);
    headers.set("Content-Length", String(fileBuffer.length));
    // Set cache headers to instruct browsers (and CDNs like Cloudflare) to cache the image for a long time
    headers.set("Cache-Control", "public, max-age=31536000, immutable");

    return new NextResponse(fileBuffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error(`[Uploads GET] Failed to serve uploaded file: ${error instanceof Error ? error.message : String(error)}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
