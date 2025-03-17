import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  {
    extends: "vite.config.ts",
    test: {
      include: ["**/*.node.test.ts"],
      setupFiles: ["src/vite/setup.node.ts"],
    },
  },
  {
    extends: "vite.config.ts",
    test: {
      include: ["**/*.browser.test.ts"],
      setupFiles: ["src/vite/setup.browser.ts"],
      browser: {
        enabled: true,
        provider: "playwright",
        // https://vitest.dev/guide/browser/playwright
        instances: [{ browser: "chromium" }],
      },
    },
  },
]);
