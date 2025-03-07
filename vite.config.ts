import { defineConfig } from "vite";
import { transformConstructableStylesheetsPlugin } from "./src/vite/css-plugin.ts";

export default defineConfig({
  // 5) add it the plugins option
  plugins: [transformConstructableStylesheetsPlugin()],
});
