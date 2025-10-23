import { page, userEvent } from "vitest/browser";
import { html } from "lit";
import { expect, it } from "vitest";

it("should pass without shadow root", async () => {
  const user = userEvent.setup();
  page.render(html`<button>Button</button>`);
  const button = page.getByRole("button");
  await user.click(button);
  expect(button.element()).toHaveFocus();
});

it("should pass with shadow root", async () => {
  const user = userEvent.setup();
  const lightContainer = document.body.appendChild(
    document.createElement("div"),
  );
  const shadow = lightContainer.attachShadow({ mode: "open" });
  const shadowContainer = shadow.appendChild(document.createElement("div"));
  page.render(html`<button>Button</button>`, { container: shadowContainer });

  const button = page.getByRole("button");
  await user.click(button);
  expect(button.element()).toHaveFocus();
});

it("should fail without shadow root", async () => {
  const user = userEvent.setup();
  page.render(html`<button>Button</button><input />`);
  const button = page.getByRole("button");
  await user.click(button);
  expect(() =>
    expect(page.getByRole("textbox").element()).toHaveFocus(),
  ).toThrowErrorMatchingSnapshot();
  expect(() =>
    expect(button.element()).not.toHaveFocus(),
  ).toThrowErrorMatchingSnapshot();
});

it("should fail with shadow root", async () => {
  const user = userEvent.setup();
  const lightContainer = document.body.appendChild(
    document.createElement("div"),
  );
  const shadow = lightContainer.attachShadow({ mode: "open" });
  const shadowContainer = shadow.appendChild(document.createElement("div"));
  page.render(html`<button>Button</button><input />`, {
    container: shadowContainer,
  });

  const button = page.getByRole("button");
  await user.click(button);
  expect(() =>
    expect(page.getByRole("textbox").element()).toHaveFocus(),
  ).toThrowErrorMatchingSnapshot();
  expect(() =>
    expect(button.element()).not.toHaveFocus(),
  ).toThrowErrorMatchingSnapshot();
});

it("should fail with invalid element", () => {
  expect(() => {
    expect(null).toHaveFocus();
  }).toThrowErrorMatchingSnapshot();
});
