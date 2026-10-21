import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { expect, it } from "vite-plus/test";
import { page, userEvent } from "vite-plus/test/browser";
import { TabGroup } from "./tab-group.ts";

@customElement("test-tab-panel")
class TestTabPanel extends LitElement {
  disconnects = 0;

  disconnectedCallback() {
    this.disconnects++;
    super.disconnectedCallback();
  }

  render() {
    return html`<input aria-label="Panel value" />`;
  }
}

@customElement("test-tab-group")
class TestTabGroup extends TabGroup {
  protected label = "Test views";
  protected tabs = ["First", "Second", "Third"].map((label) => ({
    id: label.toLowerCase(),
    label,
    render: () => html`<test-tab-panel data-testid="panel-content"></test-tab-panel>`,
  }));
}

it("shows one panel while preserving inactive panels, state and connections", async () => {
  const screen = page.render(html`<test-tab-group></test-tab-group>`);
  await expect.element(screen.getByRole("tabpanel", { name: "First", exact: true })).toBeVisible();
  const contents = screen.getByTestId("panel-content");
  const panels = contents.elements().map((element) => {
    if (!(element instanceof TestTabPanel)) {
      throw new Error("Expected a test tab panel");
    }
    return element;
  });
  await screen.getByRole("textbox", { name: "Panel value" }).fill("Keep this value");

  for (const label of ["First", "Second", "Third", "First"]) {
    const tab = screen.getByRole("tab", { name: label, exact: true });
    await tab.click();
    await expect.element(tab).toHaveAttribute("aria-selected", "true");
    const panel = screen.getByRole("tabpanel", { name: label, exact: true });
    await expect.element(panel).toBeVisible();
    expect(screen.getByRole("tabpanel").elements()).toHaveLength(1);
    expect(contents.elements()).toEqual(panels);
    for (const child of panels) {
      expect(child.isConnected).toBe(true);
      expect(child.disconnects).toBe(0);
    }
    await expect.element(tab).toHaveAttribute("aria-controls", panel.element().id);
    await expect.element(panel).toHaveAttribute("aria-labelledby", tab.element().id);
  }
  await expect
    .element(screen.getByRole("textbox", { name: "Panel value" }))
    .toHaveValue("Keep this value");
});

it("supports wrapping arrows, Home and End with roving focus in both directions", async () => {
  const screen = page.render(html`<test-tab-group data-testid="tabs"></test-tab-group>`);
  const user = userEvent.setup();
  await expect.element(screen.getByRole("tab", { name: "First", exact: true })).toBeVisible();
  expect(screen.getByTestId("tabs").element()).toBeInstanceOf(TestTabGroup);
  const tabs = ["First", "Second", "Third"].map((name) =>
    screen.getByRole("tab", { name, exact: true }),
  );
  const press = async (index: number, key: string, expected: number) => {
    await tabs[index]!.click();
    await user.keyboard(`[${key}]`);
    await expect.element(tabs[expected]!).toHaveFocus();
    await expect.element(tabs[expected]!).toHaveAttribute("aria-selected", "true");
    for (const [tabIndex, tab] of tabs.entries()) {
      await expect.element(tab).toHaveAttribute("tabindex", tabIndex === expected ? "0" : "-1");
    }
  };
  await press(0, "ArrowLeft", 2);
  await press(2, "ArrowRight", 0);
  await press(0, "End", 2);
  await press(2, "Home", 0);
  screen.getByTestId("tabs").element().setAttribute("dir", "rtl");
  await press(0, "ArrowRight", 2);
  await press(2, "ArrowLeft", 0);
});
