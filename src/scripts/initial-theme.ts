import * as v from "valibot";
import { assert } from "../utils/index.ts";
const themeSchema = v.picklist(["light", "dark"]);

try {
  // don't run in SSR
  assert(typeof window !== "undefined");
  document.documentElement.dataset.theme = v.parse(
    themeSchema,
    localStorage.getItem("theme"),
  );
} catch {
  // ignore
}
