import * as v from "valibot";
import {
  caseSchema,
  pkgManagerSchema,
  themeSchema,
} from "../constants/prefs.ts";
import { assert } from "../utils/index.ts";

try {
  // don't run in SSR
  assert(typeof window !== "undefined");
  document.documentElement.dataset.theme = v.parse(
    themeSchema,
    localStorage.getItem("theme"),
  );
  document.documentElement.dataset.pm = v.parse(
    pkgManagerSchema,
    localStorage.getItem("packageManager"),
  );
  document.documentElement.dataset.case = v.parse(
    caseSchema,
    localStorage.getItem("case"),
  );
} catch {
  // ignore
}
