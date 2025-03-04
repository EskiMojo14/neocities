import { readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const srcDirs = (await readdir("./src", { withFileTypes: true }))
  .filter((dir) => dir.isDirectory())
  .map((dir) => dir.name);

export default defineConfig({
  resolve: {
    alias: [
      {
        find: new RegExp(`^/(${srcDirs.join("|")})/(.*)$`),
        replacement: fileURLToPath(new URL("/src/$1/$2", import.meta.url)),
      },
    ],
  },
});
