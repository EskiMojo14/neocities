import { html } from "lit";
import { afterAll, expect } from "vitest";
import { page, userEvent } from "vitest/browser";
import { themePref } from "../../../constants/prefs.ts";
import { capitalize } from "../../../utils/index.ts";
import { it } from "../../../vite/utils.browser.ts";
import "./theme-toggle.ts";

afterAll(() => {
  localStorage.clear();
});

it("should select the correct theme", async () => {
  const user = userEvent.setup();

  const { getByLabelText } = page.render(html`<theme-toggle></theme-toggle>`);

  for (const theme of themePref.options) {
    const label = getByLabelText(`${capitalize(theme)} theme`);
    await user.click(label);
    expect(themePref.data).toBe(theme);
  }
});
