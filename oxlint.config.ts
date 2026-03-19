import { defineConfig, type OxlintOverride } from "oxlint";
import { configs as storybook } from "eslint-plugin-storybook";
import { configs as lit } from "eslint-plugin-lit";

export default defineConfig({
  options: { typeAware: true, reportUnusedDisableDirectives: "error" },
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
});
