import { html } from "lit";
import { expect } from "vitest";
import { page } from "vitest/browser";
import { pkgManagerPref } from "../../constants/prefs.ts";
import { it } from "../../vite/utils.browser.ts";
import "./pkg-info.ts";

it("should only show docs link when set", async () => {
  const screen = page.render(html`
    <pkg-info pkg="foo" repo="foo"></pkg-info>
  `);
  const links = {
    docs: screen.getByRole("link", { name: "Docs" }),
    npm: screen.getByRole("link", { name: "NPM" }),
    github: screen.getByRole("link", { name: "GitHub" }),
  };
  expect(links.docs.query()).not.toBeInTheDocument();
  await expect.element(links.npm).toBeInTheDocument();
  await expect.element(links.github).toBeInTheDocument();

  screen.rerender(html`
    <pkg-info pkg="foo" repo="foo" docs="https://foo.com"></pkg-info>
  `);
  await expect.element(links.docs).toBeInTheDocument();
});

it("should show install command when include-install is set", async () => {
  const screen = page.render(html`
    <pkg-info pkg="foo" repo="foo"></pkg-info>
  `);
  expect(screen.getByText("Install with").query()).not.toBeInTheDocument();

  screen.rerender(html`
    <pkg-info pkg="foo" repo="foo" include-install></pkg-info>
  `);
  await expect.element(screen.getByText("Install with")).toBeInTheDocument();
});

it("should show devDep flag when set", async () => {
  const screen = page.render(html`
    <pkg-info pkg="foo" repo="foo" include-install></pkg-info>
  `);
  expect(screen.getByText("-D").query()).not.toBeInTheDocument();

  screen.rerender(html`
    <pkg-info pkg="foo" repo="foo" dev-dep="true" include-install></pkg-info>
  `);
  await expect.element(screen.getByText("-D")).toBeInTheDocument();
});

it("should allow switching between package managers", async () => {
  localStorage.removeItem(pkgManagerPref.storageKey);

  const screen = page.render(html`
    <pkg-info pkg="foo" repo="foo" include-install></pkg-info>
  `);

  for (const pkgManager of pkgManagerPref.options) {
    const button = screen.getByLabelText(`Install with ${pkgManager}`);

    await button.click();
    await expect.poll(() => pkgManagerPref.storage).toBe(pkgManager);
    await expect
      .poll(() =>
        document
          .querySelector("pkg-info")
          ?.shadowRoot?.getElementById("install-command"),
      )
      .toHaveTextContent(
        `${pkgManager} ${pkgManagerPref.meta[pkgManager].install} ${pkgManagerPref.meta[pkgManager].prefix ?? ""}foo`,
      );
  }
});
