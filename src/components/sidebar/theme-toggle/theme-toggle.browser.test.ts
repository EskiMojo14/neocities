import { page, userEvent } from "@vitest/browser/context";
import { html } from "lit";
import { afterAll, expect, it } from "vitest";
import { themeSchema } from "../../../constants/prefs.ts";
import "./theme-toggle.ts";

afterAll(() => {
  localStorage.clear();
});

it("should toggle theme", async () => {
  const user = userEvent.setup();
  const { getByRole } = page.render(html`<theme-toggle></theme-toggle>`);
  const button = getByRole("button");

  let first = true;
  for (const theme of themeSchema.options) {
    await expect.element(button).toHaveAttribute("data-selected", theme);
    await expect
      .poll(() => localStorage.getItem("theme"))
      .toBe(first ? null : theme);
    await expect.element(document.documentElement).toHaveData("theme", theme);

    await user.click(button);
    first = false;
  }
});
