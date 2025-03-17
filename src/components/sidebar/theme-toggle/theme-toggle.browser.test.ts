import { page, userEvent } from "@vitest/browser/context";
import { html } from "lit";
import { expect, it } from "vitest";
import "./theme-toggle.ts";

it("should toggle theme", async () => {
  const user = userEvent.setup();
  const { getByRole } = page.render(html`<theme-toggle></theme-toggle>`);
  const button = getByRole("button");
  await user.click(button);
  expect(document.documentElement.dataset.theme).toBe("light");
  expect(localStorage.getItem("theme")).toBe("light");
  await user.click(button);
  expect(document.documentElement.dataset.theme).toBe("dark");
  expect(localStorage.getItem("theme")).toBe("dark");
});
