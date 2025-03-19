import "mix-n-matchers/vitest";
import { expect } from "vitest";
import "vitest-browser-lit";
import { toHaveData } from "./matchers/to-have-data.ts";
import { toHaveFocus } from "./matchers/to-have-focus.ts";
import "../styles/global.css";

document.documentElement.dataset.theme = "dark";

expect.extend({
  // replace jest-dom matcher with one that supports shadow roots
  toHaveFocus,
  toHaveData,
});
