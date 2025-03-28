import { page, userEvent } from "@vitest/browser/context";
import { html } from "lit";
import { afterAll, expect, it } from "vitest";
import { themeSchema } from "../../../constants/prefs.ts";
import { capitalize } from "../../../utils/index.ts";
import "./theme-toggle.ts";

afterAll(() => {
  localStorage.clear();
});

it("should select the correct theme", async () => {
  const user = userEvent.setup();

  const { getByLabelText } = page.render(html`<theme-toggle></theme-toggle>`);

  for (const theme of themeSchema.options) {
    const label = getByLabelText(`${capitalize(theme)} theme`);
    await user.click(label);
    expect(document.documentElement.dataset.theme).toBe(theme);
  }
});
