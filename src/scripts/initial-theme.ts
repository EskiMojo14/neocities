import * as v from "valibot";
const themeSchema = v.picklist(["light", "dark"]);

try {
  document.documentElement.dataset.theme = v.parse(
    themeSchema,
    localStorage.getItem("theme"),
  );
} catch {
  // ignore
}
