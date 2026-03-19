import { playwright } from "vite-plus/test/browser-playwright";
import { defineConfig } from "vite-plus";
import { transformRawImports } from "./src/vite/raw-plugin.ts";
import { configs as storybook } from "eslint-plugin-storybook";
import { configs as lit } from "eslint-plugin-lit";
import type { OxlintOverride } from "vite-plus/lint";

export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  lint: {
    options: { typeAware: true, typeCheck: true, reportUnusedDisableDirectives: "error" },
    plugins: ["typescript", "import", "vitest"],
    categories: {
      correctness: "warn",
      suspicious: "warn",
    },
    jsPlugins: [
      {
        name: "storybook",
        specifier: "eslint-plugin-storybook",
      },
      {
        name: "lit",
        specifier: "eslint-plugin-lit",
      },
    ],
    rules: {
      ...lit.recommended.rules,
      "import/no-absolute-path": "error",
      "import/extensions": ["error", "ignorePackages"],
      "import/no-unassigned-import": "off",
      "typescript/array-type": ["error", { default: "generic" }],
      "typescript/no-empty-object-type": "off",
      "typescript/no-explicit-any": "warn",
      "typescript/only-throw-error": "off",
      "typescript/restrict-template-expressions": ["error", { allowNumber: true }],
      "typescript/no-namespace": "off",
      "typescript/unbound-method": "off",
      "typescript/consistent-type-imports": ["error", { fixStyle: "separate-type-imports" }],
      "no-shadow": "off",
    },
    overrides: [
      ...(storybook.recommended.overrides as unknown as Array<OxlintOverride>),
      {
        files: ["**/*.test.{js,mjs,cjs,ts,jsx,tsx}"],
        rules: {
          "vitest/valid-title": ["error", { allowArguments: true }],
        },
      },
    ],
  },
  fmt: {
    ignorePatterns: ["mockServiceWorker.js"],
  },
  publicDir: "./src/assets",
  // 5) add it the plugins option
  plugins: [transformRawImports()],
  define: {
    "process.env": Object.fromEntries(
      Object.entries(process.env).filter(
        ([key]) => key === "NODE_ENV" || key.startsWith("LASTFM") || key.startsWith("VITE"),
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
  run: {
    tasks: {
      clean: {
        command: "rm -rf ./public/",
      },
      "generate-thumbs": {
        command: "node scripts/generate-thumbs.ts",
      },
      dev: {
        command:
          "node --env-file-if-exists .env --import @greenwood/cli/register ./node_modules/@greenwood/cli/src/bin.js develop",
      },
      build: {
        dependsOn: ["clean", "generate-thumbs"],
        command:
          "node --env-file-if-exists .env --import @greenwood/cli/register ./node_modules/@greenwood/cli/src/bin.js build",
      },
      serve: {
        command:
          "node --env-file-if-exists .env --import @greenwood/cli/register ./node_modules/@greenwood/cli/src/bin.js serve",
      },
      storybook: {
        command: "storybook dev -p 6006",
      },
      "build-storybook": {
        command: "storybook build",
      },
    },
  },
});
