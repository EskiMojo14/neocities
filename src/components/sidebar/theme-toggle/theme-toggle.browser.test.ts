import { page, userEvent } from "@vitest/browser/context";
import { html } from "lit";
import { expect, it } from "vitest";
import "./theme-toggle.ts";

it("should toggle theme", async () => {
  const user = userEvent.setup();
  const { getByRole } = page.render(html`<theme-toggle></theme-toggle>`);
  const button = getByRole("button");

  expect(document.documentElement).toHaveData("theme", "dark");
  await expect.element(button).toHaveAttribute("aria-pressed", "true");

  await user.click(button);
  expect(document.documentElement).toHaveData("theme", "light");
  expect(localStorage.getItem("theme")).toBe("light");
  await expect.element(button).toHaveAttribute("aria-pressed", "false");

  await user.click(button);
  expect(document.documentElement).toHaveData("theme", "dark");
  expect(localStorage.getItem("theme")).toBe("dark");
  await expect.element(button).toHaveAttribute("aria-pressed", "true");
});
