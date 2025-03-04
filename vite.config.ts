import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^\/(components|utils)\/(.*)$/,
        replacement: fileURLToPath(new URL("/src/$1/$2", import.meta.url)),
      },
    ],
  },
});
