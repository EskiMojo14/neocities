import type { RawMatcherFn } from "@vitest/expect";
import { assert } from "../../utils/index.ts";

export const toHaveData: RawMatcherFn = function (
  element,
  key: string,
  value?: string,
) {
  assert(
    element instanceof HTMLElement,
    "Expected element to be an HTMLElement",
  );
  const hasValue = typeof value !== "undefined";
  return {
    pass: !hasValue ? key in element.dataset : element.dataset[key] === value,
    message: () => {
      return [
        this.utils.matcherHint("toHaveData", "element", "key", {
          isNot: this.isNot,
          promise: this.promise,
          secondArgument: !hasValue ? undefined : "value",
        }),
        ...(this.isNot
          ? hasValue
            ? [
                `Expected element without data attribute "${key}": ${this.utils.printExpected(value)}`,
                `Received element with data attribute "${key}": ${this.utils.printReceived(element.dataset[key])}`,
              ]
            : [
                `Expected element without data attribute "${key}"`,
                `Received element with data attribute "${key}"`,
              ]
          : hasValue
            ? [
                `Expected element with data attribute "${key}": ${this.utils.printExpected(
                  value,
                )}`,
                `Received element with data attribute "${key}": ${this.utils.printReceived(
                  element.dataset[key],
                )}`,
              ]
            : [
                `Expected element with data attribute "${key}"`,
                `Received element without data attribute "${key}"`,
              ]),
      ].join("\n");
    },
  };
};

declare module "vitest" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  interface Assertion<T = any> {
    /**
     * Assert that a data attribute exists.
     * @param key The data attribute key.
     *
     * @example
     * <button data-foo="bar">text</button>
     *
     * expect(element).toHaveData("foo");
     */
    toHaveData(key: string): void;
    /**
     * Assert that a data attribute exists and has a specific value.
     * @param key The data attribute key.
     * @param value The data attribute value.
     *
     * @example
     * <button data-foo="bar">text</button>
     *
     * expect(element).toHaveData("foo", "bar");
     */
    // eslint-disable-next-line @typescript-eslint/unified-signatures
    toHaveData(key: string, value: string): void;
  }
}
