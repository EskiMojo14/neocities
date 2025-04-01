import { pkgManagerPref, stylePref, themePref } from "../constants/prefs.ts";
import { assert } from "../utils/index.ts";

try {
  // don't run in SSR
  assert(typeof window !== "undefined");
  for (const pref of [pkgManagerPref, themePref, stylePref]) {
    pref.data = pref.storage;
  }
} catch {
  // ignore
}
