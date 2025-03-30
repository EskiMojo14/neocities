import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { glob } from "glob";
import sharp from "sharp";

function normalizePath(path: string) {
  return path.replace(/\\/g, "/");
}

const imagePaths = await glob("src/assets/**/!(*icon).{png,jpg,jpeg}", {
  ignore: ["src/assets/thumbs/**/*"],
});

for (const imagePath of imagePaths.map(normalizePath)) {
  const thumbPath = imagePath.replace("src/assets", "src/assets/thumbs");

  // make sure the directory exists
  await mkdir(dirname(thumbPath), { recursive: true });

  await sharp(imagePath)
    .resize({
      height: 300,
      fit: "contain",
    })
    .toFile(thumbPath);
}
