/* eslint-disable no-empty-pattern */
import { html } from "lit";
import type { SetupWorker } from "msw/browser";
import { test as baseTest } from "vitest";
import type { UserEvent } from "vitest/browser";
import { page, userEvent } from "vitest/browser";
import "../components/sidebar/style-toggle/style-toggle.ts";
import type { Style } from "../constants/prefs.ts";
import { stylePref } from "../constants/prefs.ts";
import { worker } from "../mocks/browser.ts";
import { capitalize, unsafeFromEntries } from "../utils/index.ts";

const styleToggles = unsafeFromEntries(
  stylePref.options.map((opt) => [
    opt,
    page.getByLabelText(`${capitalize(opt)} style`),
  ]),
);

export const test = baseTest.extend<{
  worker: SetupWorker;
  user: UserEvent;
  setStyle: (style: Style) => Promise<void>;
}>({
  setStyle: async ({}, use) => {
    page.render(html`<style-toggle></style-toggle>`);

    await use((style) => styleToggles[style].click());

    await styleToggles[stylePref.fallback].click();
  },
  worker: [
    async ({}, use) => {
      // Start the worker before the test.
      await worker.start();

      // Expose the worker object on the test's context.
      await use(worker);

      // Remove any request handlers added in individual test cases.
      // This prevents them from affecting unrelated tests.
      worker.resetHandlers();

      // Stop the worker after the test.
      worker.stop();
    },
    {
      auto: true,
    },
  ],
  user: ({}, use) => use(userEvent.setup()),
});

export { test as it };
