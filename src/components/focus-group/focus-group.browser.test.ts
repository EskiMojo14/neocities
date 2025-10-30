import { html } from "lit";
import { expect } from "vitest";
import { page } from "vitest/browser";
import { it } from "../../vite/utils.browser.ts";
import "./focus-group.ts";

it("should move focus with arrow keys", async ({ user }) => {
  const screen = page.render(html`
    <focus-group>
      <button>1</button>
      <button>2</button>
      <button>3</button>
    </focus-group>
  `);
  const buttons = {
    1: screen.getByText("1"),
    2: screen.getByText("2"),
    3: screen.getByText("3"),
  };
  await buttons[1].click();
  await expect.element(buttons[1]).toHaveFocus();
  await user.keyboard("[ArrowRight]");
  await expect.element(buttons[2]).toHaveFocus();
  await user.keyboard("[ArrowRight]");
  await expect.element(buttons[3]).toHaveFocus();

  await user.keyboard("[ArrowLeft]");
  await expect.element(buttons[2]).toHaveFocus();
  await user.keyboard("[ArrowLeft]");
  await expect.element(buttons[1]).toHaveFocus();
});
