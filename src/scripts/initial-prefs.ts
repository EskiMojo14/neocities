import * as v from "valibot";
import { casePref, pkgManagerPref, themePref } from "../constants/prefs.ts";
import { assert } from "../utils/index.ts";

try {
  // don't run in SSR
  assert(typeof window !== "undefined");
  for (const pref of [pkgManagerPref, themePref, casePref]) {
    document.documentElement.dataset[pref.dataKey] = v.parse(
      pref.schema,
      localStorage.getItem(pref.storageKey),
    );
  }
} catch {
  // ignore
}
