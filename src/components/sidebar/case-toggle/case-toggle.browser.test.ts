import { page, userEvent } from "@vitest/browser/context";
import { html } from "lit";
import { afterAll, expect, it } from "vitest";
import { caseSchema } from "../../../constants/prefs.ts";
import { capitalize } from "../../../utils/index.ts";
import "./case-toggle.ts";

afterAll(() => {
  localStorage.clear();
});

it("should select the correct case", async () => {
  const user = userEvent.setup();

  const { getByLabelText } = page.render(html`<case-toggle></case-toggle>`);

  for (const theme of caseSchema.options) {
    const label = getByLabelText(`${capitalize(theme)} case`);
    await user.click(label);
    expect(document.documentElement.dataset.case).toBe(theme);
  }
});
