import fs from "fs";
import path from "path";

export const getUploadsDir = (): string => {
  if (process.env.UPLOADS_DIR) {
    return process.env.UPLOADS_DIR;
  }

  return path.join(process.cwd(), "public", "uploads");
};

export const ensureUploadsDir = async (): Promise<string> => {
  const dir = getUploadsDir();
  await fs.promises.mkdir(dir, { recursive: true });
  return dir;
};

export const sanitizeFileName = (name: string): string => {
  return name.replace(/[^a-zA-Z0-9]/g, "-");
};


