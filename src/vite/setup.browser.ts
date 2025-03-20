import "mix-n-matchers/vitest";
import { expect } from "vitest";
import "vitest-browser-lit";
import { pkgManagerSchema, themeSchema } from "../constants/prefs.ts";
import { toHaveData } from "./matchers/to-have-data.ts";
import { toHaveFocus } from "./matchers/to-have-focus.ts";
import "../styles/global.css";

document.documentElement.dataset.theme = themeSchema.fallback;
document.documentElement.dataset.pm = pkgManagerSchema.fallback;

expect.extend({
  // replace jest-dom matcher with one that supports shadow roots
  toHaveFocus,
  toHaveData,
});
