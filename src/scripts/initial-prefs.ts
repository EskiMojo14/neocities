import { pkgManagerPref, stylePref, themePref } from "../constants/prefs.ts";

if (typeof window !== "undefined") {
  for (const pref of [pkgManagerPref, themePref, stylePref]) {
    pref.data = pref.storage;
  }
}
