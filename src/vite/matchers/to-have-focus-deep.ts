import type { RawMatcherFn } from "@vitest/expect";
import { assert } from "../../utils/index.ts";

export const toHaveFocusDeep: RawMatcherFn = function (element) {
  assert(
    element instanceof HTMLElement,
    "Expected element to be an HTMLElement",
  );

  let pass = false as boolean;
  let cursor = element.ownerDocument.activeElement;
  while (!pass && cursor) {
    pass = cursor === element;
    if (pass) break;
    cursor = cursor.shadowRoot?.activeElement ?? null;
  }

  return {
    pass,
    message: () => {
      return [
        this.utils.matcherHint(
          `${this.isNot ? ".not" : ""}.toHaveFocusDeep`,
          "element",
          "",
        ),
        ...(this.isNot
          ? [
              "Received element is focused:",
              `  ${this.utils.printReceived(element)}`,
            ]
          : [
              "Expected element with focus:",
              `  ${this.utils.printExpected(element)}`,
              "Received element with focus:",
              `  ${this.utils.printReceived(
                element.ownerDocument.activeElement,
              )}`,
            ]),
      ].join("\n");
    },
  };
};

declare module "vitest" {
  interface Assertion<T = any> {
    toHaveFocusDeep(): void;
  }
}
