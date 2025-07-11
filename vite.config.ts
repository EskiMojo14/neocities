import { defineConfig } from "vite";
import { transformRawImports } from "./src/vite/raw-plugin.ts";

export default defineConfig({
  publicDir: "./src/assets",
  // 5) add it the plugins option
  plugins: [transformRawImports()],
  define: {
    "process.env": Object.fromEntries(
      Object.entries(process.env).filter(([key]) => key.startsWith("LASTFM")),
    ),
  },
});
