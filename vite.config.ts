import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";
import { transformRawImports } from "./src/vite/raw-plugin.ts";

export default defineConfig({
  publicDir: "./src/assets",
  // 5) add it the plugins option
  plugins: [transformRawImports()],
  define: {
    "process.env": Object.fromEntries(
      Object.entries(process.env).filter(
        ([key]) =>
          key === "NODE_ENV" ||
          key.startsWith("LASTFM") ||
          key.startsWith("VITE"),
      ),
    ),
  },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: "node",
          include: ["**/*.node.test.ts"],
          setupFiles: ["src/vite/setup.node.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "browser",
          include: ["**/*.browser.test.ts"],
          setupFiles: ["src/vite/setup.browser.ts"],
          browser: {
            enabled: true,
            provider: playwright(),
            // https://vitest.dev/guide/browser/playwright
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },
});
