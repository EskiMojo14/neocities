import type { RawMatcherFn } from "@vitest/expect";
import { assert } from "../../utils/index.ts";

export const toHaveFocus: RawMatcherFn = function (element) {
  assert(element instanceof Element, "Expected element to be an Element");
  const root = element.getRootNode();
  assert(
    root instanceof Document || root instanceof ShadowRoot,
    "Expected element to be in a Document or ShadowRoot",
  );
  return {
    pass: root.activeElement === element,
    message: () => {
      return [
        this.utils.matcherHint(
          `${this.isNot ? ".not" : ""}.toHaveFocus`,
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
              `  ${this.utils.printReceived(root.activeElement)}`,
            ]),
      ].join("\n");
    },
  };
};
