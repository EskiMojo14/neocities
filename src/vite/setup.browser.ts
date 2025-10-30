import "mix-n-matchers/vitest";
import { expect, vi } from "vitest";
import "vitest-browser-lit";
import type * as env from "../constants/env.ts";
import { pkgManagerPref, stylePref, themePref } from "../constants/prefs.ts";
import { toHaveData } from "./matchers/to-have-data.ts";
import { toHaveFocus } from "./matchers/to-have-focus.ts";
import "../styles/global.css";

vi.mock("../constants/env.ts", (): typeof env => ({
  default: {
    LASTFM_API_KEY: "mocked",
    LASTFM_SECRET: "mocked",
    LASTFM_USER: "mocked",
  },
}));

localStorage.clear();
for (const pref of [pkgManagerPref, themePref, stylePref]) {
  pref.data = pref.fallback;
}

expect.extend({
  // replace matcher with one that supports shadow roots
  toHaveFocus,
  toHaveData,
});
