import { html } from "lit";
import { expect, it } from "vitest";
import { page, userEvent } from "vitest/browser";
import "./focus-group.ts";

it("should move focus with arrow keys", async () => {
  const user = userEvent.setup();
  const { getByText } = page.render(html`
    <focus-group>
      <button>1</button>
      <button>2</button>
      <button>3</button>
    </focus-group>
  `);
  const buttons = {
    1: getByText("1"),
    2: getByText("2"),
    3: getByText("3"),
  };
  await user.click(buttons[1]);
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
