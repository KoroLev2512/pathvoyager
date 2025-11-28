import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { ensureUploadsDir, sanitizeFileName } from "@/server/uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ message: "Файл не был загружен" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ message: "Разрешены только изображения" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ message: "Файл слишком большой (макс. 10MB)" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadsDir = await ensureUploadsDir();

    const originalExt = path.extname(file.name) || `.${file.type.split("/").pop() ?? "png"}`;
    const safeName = sanitizeFileName(path.basename(file.name, originalExt)) || "image";
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${safeName}${originalExt}`;
    const filePath = path.join(uploadsDir, filename);

    await fs.promises.writeFile(filePath, buffer);

    console.log("File uploaded successfully:", {
      filename,
      path: filePath,
      size: buffer.length,
      uploadsDir,
    });

    return NextResponse.json({
      url: `/uploads/${filename}`,
      filename,
      originalName: file.name,
      size: buffer.length,
      path: filePath,
    });
  } catch (error) {
    console.error("Failed to upload file", error);
    return NextResponse.json({ message: "Ошибка при загрузке файла" }, { status: 500 });
  }
}


