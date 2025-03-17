import { expect } from "vitest";
import { toHaveFocus } from "./src/vite/matchers/to-have-focus-deep.ts";

expect.extend({
  // replace jest-dom matcher with one that supports shadow roots
  toHaveFocus,
});
