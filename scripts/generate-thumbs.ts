import * as fs from "node:fs/promises";
import * as path from "node:path";
import sharp from "sharp";

function normalizePath(path: string) {
  return path.replace(/\\/g, "/");
}

for await (let imagePath of fs.glob("src/assets/**/!(*icon).{png,jpg,jpeg}", {
  exclude: ["src/assets/thumbs/**/*"],
})) {
  imagePath = normalizePath(imagePath);
  const thumbPath = imagePath.replace("src/assets", "src/assets/thumbs");

  // make sure the directory exists
  await fs.mkdir(path.dirname(thumbPath), { recursive: true });

  await sharp(imagePath)
    .resize({
      height: 300,
      fit: "contain",
    })
    .toFile(thumbPath);
}
