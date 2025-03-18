import { page } from "@vitest/browser/context";
import "mix-n-matchers/vitest";
import { beforeEach, expect } from "vitest";
import { cleanup, render } from "./lit-render.ts";
import { toHaveData } from "./matchers/to-have-data.ts";
import { toHaveFocus } from "./matchers/to-have-focus.ts";
import "../styles/global.css";

document.documentElement.dataset.theme = "dark";

page.extend({
  render,
});

beforeEach(() => {
  cleanup();
});

declare module "@vitest/browser/context" {
  interface BrowserPage {
    render: typeof render;
  }
}

expect.extend({
  // replace jest-dom matcher with one that supports shadow roots
  toHaveFocus,
  toHaveData,
});
