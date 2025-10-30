/* eslint-disable no-empty-pattern */
import type { SetupWorker } from "msw/browser";
import { test as baseTest } from "vitest";
import type { UserEvent } from "vitest/browser";
import { userEvent } from "vitest/browser";
import { worker } from "../mocks/browser.ts";

export const test = baseTest.extend<{ worker: SetupWorker; user: UserEvent }>({
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
