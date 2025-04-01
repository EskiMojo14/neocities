import "mix-n-matchers/vitest";
import { expect } from "vitest";
import "vitest-browser-lit";
import { pkgManagerPref, stylePref, themePref } from "../constants/prefs.ts";
import { toHaveData } from "./matchers/to-have-data.ts";
import { toHaveFocus } from "./matchers/to-have-focus.ts";
import "../styles/global.css";

localStorage.clear();
for (const pref of [pkgManagerPref, themePref, stylePref]) {
  pref.data = pref.fallback;
}

expect.extend({
  // replace jest-dom matcher with one that supports shadow roots
  toHaveFocus,
  toHaveData,
});
