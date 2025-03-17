import { expect } from "vitest";
import "./lit-render.ts";
import { toHaveFocus } from "./matchers/to-have-focus.ts";

expect.extend({
  // replace jest-dom matcher with one that supports shadow roots
  toHaveFocus,
});
