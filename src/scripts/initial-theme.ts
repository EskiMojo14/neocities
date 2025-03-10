import * as v from "valibot";
const themeSchema = v.picklist(["light", "dark"]);

try {
  const themeFromStorage = localStorage.getItem("theme");
  const theme = v.parse(themeSchema, themeFromStorage);
  document.documentElement.dataset.theme = theme;
} catch {
  // ignore
}
