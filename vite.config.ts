import { defineConfig } from "vite";
import { transformRawImports } from "./src/vite/raw-plugin.ts";

export default defineConfig({
  // 5) add it the plugins option
  plugins: [transformRawImports()],
});
