import { html } from "lit";
import { afterAll, expect } from "vitest";
import { page, userEvent } from "vitest/browser";
import { stylePref } from "../../../constants/prefs.ts";
import { capitalize } from "../../../utils/index.ts";
import { it } from "../../../vite/utils.browser.ts";
import "./style-toggle.ts";

afterAll(() => {
  localStorage.clear();
});

it("should select the correct style", async () => {
  const user = userEvent.setup();

  const { getByLabelText } = page.render(html`<style-toggle></style-toggle>`);

  for (const theme of stylePref.options) {
    const label = getByLabelText(`${capitalize(theme)} style`);
    await user.click(label);
    expect(stylePref.data).toBe(theme);
  }
});
