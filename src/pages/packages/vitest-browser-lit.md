---
layout: packages
title: Vitest Browser Lit
description: For testing Lit components with Vitest Browser mode
icon: labs
package: vitest-browser-lit
devDep: true
repo: EskiMojo14/vitest-browser-lit
---

A library for rendering lit components in Vitest Browser mode. Provides the usual methods like `render`, `rerender`, and `unmount`.

```ts
import { html } from "lit";
import { expect, it } from "vitest";
import { render } from "vitest-browser-lit";

it("should render", () => {
  const { getByText, rerender, unmount } = render(html`<p>foo</p>`);

  expect(getByText("foo")).toBeInTheDocument();

  rerender(html`<p>bar</p>`);

  expect(getByText("bar")).toBeInTheDocument();

  unmount();
});
```

Default endpoint will also enable auto-cleanup and add `page.render`:

```ts
// test-setup
import "vitest-browser-lit";

// my-test.test.ts
import { page } from "@vitest/browser/context";
import { html } from "lit";
import { expect, it } from "vitest";

it("should render", () => {
  const { getByText, rerender, unmount } = page.render(html`<p>foo</p>`);

  expect(getByText("foo")).toBeInTheDocument();

  rerender(html`<p>bar</p>`);

  expect(getByText("bar")).toBeInTheDocument();

  unmount();
});
```

If you don't want this, import from `vitest-browser-lit/pure` instead.

```ts
import { html } from "lit";
import { expect, it, beforeEach } from "vitest";
import { render, cleanup } from "vitest-browser-lit/pure";

beforeEach(() => {
  cleanup();
});

it("should render", () => {
  const { getByText, rerender, unmount } = render(html`<p>foo</p>`);

  expect(getByText("foo")).toBeInTheDocument();

  rerender(html`<p>bar</p>`);

  expect(getByText("bar")).toBeInTheDocument();

  unmount();
});
```

Unlike with testing-library, cleanup is done _before_ tests, so page can be viewed after tests have run.
