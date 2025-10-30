import { html } from "lit";
import { afterAll, expect } from "vitest";
import { page } from "vitest/browser";
import { stylePref } from "../../../constants/prefs.ts";
import { capitalize } from "../../../utils/index.ts";
import { it } from "../../../vite/utils.browser.ts";
import "./style-toggle.ts";

afterAll(() => {
  localStorage.clear();
});

it("should select the correct style", async () => {
  const screen = page.render(html`<style-toggle></style-toggle>`);

  for (const theme of stylePref.options) {
    const label = screen.getByLabelText(`${capitalize(theme)} style`);
    await label.click();
    expect(stylePref.data).toBe(theme);
  }
});
