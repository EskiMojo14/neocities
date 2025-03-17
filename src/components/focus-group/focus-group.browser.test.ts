import { page, userEvent } from "@vitest/browser/context";
import { html, render } from "lit";
import { expect, it } from "vitest";
import "./focus-group.ts";

it("should move focus with arrow keys", async () => {
  const user = userEvent.setup();
  render(
    html`
      <focus-group>
        <button>1</button>
        <button>2</button>
        <button>3</button>
      </focus-group>
    `,
    document.body,
  );
  const buttons = {
    1: page.getByText("1"),
    2: page.getByText("2"),
    3: page.getByText("3"),
  };
  await user.click(buttons[1]);
  await expect.element(buttons[1]).toHaveFocusDeep();
  await user.keyboard("[ArrowRight]");
  await expect.element(buttons[2]).toHaveFocusDeep();
  await user.keyboard("[ArrowRight]");
  await expect.element(buttons[3]).toHaveFocusDeep();

  await user.keyboard("[ArrowLeft]");
  await expect.element(buttons[2]).toHaveFocusDeep();
  await user.keyboard("[ArrowLeft]");
  await expect.element(buttons[1]).toHaveFocusDeep();
});
