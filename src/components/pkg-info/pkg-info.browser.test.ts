import { page, userEvent } from "@vitest/browser/context";
import { html } from "lit";
import { expect, it } from "vitest";
import { installCommands, pkgManagerSchema } from "../../constants/prefs.ts";
import "./pkg-info.ts";

it("should only show docs link when set", async () => {
  const { getByRole, rerender } = page.render(html`
    <pkg-info pkg="foo" repo="foo"></pkg-info>
  `);
  const links = {
    docs: getByRole("link", { name: "Docs" }),
    npm: getByRole("link", { name: "NPM" }),
    github: getByRole("link", { name: "GitHub" }),
  };
  expect(links.docs.query()).not.toBeInTheDocument();
  await expect.element(links.npm).toBeInTheDocument();
  await expect.element(links.github).toBeInTheDocument();

  rerender(html`
    <pkg-info pkg="foo" repo="foo" docs="https://foo.com"></pkg-info>
  `);
  await expect.element(links.docs).toBeInTheDocument();
});

it("should show install command when include-install is set", async () => {
  const { getByText, rerender } = page.render(html`
    <pkg-info pkg="foo" repo="foo"></pkg-info>
  `);
  expect(getByText("Install with").query()).not.toBeInTheDocument();

  rerender(html` <pkg-info pkg="foo" repo="foo" include-install></pkg-info> `);
  await expect.element(getByText("Install with")).toBeInTheDocument();
});

it("should show devDep flag when set", async () => {
  const { getByText, rerender } = page.render(html`
    <pkg-info pkg="foo" repo="foo" include-install></pkg-info>
  `);
  expect(getByText("-D").query()).not.toBeInTheDocument();

  rerender(html`
    <pkg-info pkg="foo" repo="foo" dev-dep="true" include-install></pkg-info>
  `);
  await expect.element(getByText("-D")).toBeInTheDocument();
});

it("should allow switching between package managers", async () => {
  localStorage.removeItem("packageManager");
  const user = userEvent.setup();

  const { getByLabelText } = page.render(html`
    <pkg-info pkg="foo" repo="foo" include-install></pkg-info>
  `);

  for (const pkgManager of pkgManagerSchema.options) {
    const button = getByLabelText(`Install with ${pkgManager}`);

    await user.click(button);
    await expect
      .poll(() => localStorage.getItem("packageManager"))
      .toBe(pkgManager);
    await expect
      .poll(() =>
        document
          .querySelector("pkg-info")
          ?.shadowRoot?.getElementById("install-command"),
      )
      .toHaveTextContent(`${pkgManager} ${installCommands[pkgManager]} foo`);
  }
});
