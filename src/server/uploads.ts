import fs from "fs";
import path from "path";

function findProjectRoot(startDir: string): string {
  let currentDir = startDir;
  // Look for a marker file, like `package.json`, which is at the project root.
  while (!fs.existsSync(path.join(currentDir, "package.json"))) {
    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      // Reached the filesystem root and couldn't find the marker.
      // Fallback to cwd as a last resort.
      return process.cwd();
    }
    currentDir = parentDir;
  }
  return currentDir;
}

export const getUploadsDir = (): string => {
  if (process.env.UPLOADS_DIR) {
    return process.env.UPLOADS_DIR;
  }

  // Find the project root by looking for package.json, starting from the current script's directory.
  const projectRoot = findProjectRoot(__dirname);

  return path.join(projectRoot, "public", "uploads");
};

export const ensureUploadsDir = async (): Promise<string> => {
  const dir = getUploadsDir();
  await fs.promises.mkdir(dir, { recursive: true });
  return dir;
};

export const sanitizeFileName = (name: string): string => {
  return name.replace(/[^a-zA-Z0-9]/g, "-");
};


