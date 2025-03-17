import type { RawMatcherFn } from "@vitest/expect";
import { assert } from "../../utils/index.ts";

export const toHaveFocusDeep: RawMatcherFn = function (element) {
  assert(element instanceof Element, "Expected element to be an Element");

  let pass = false as boolean;
  let cursor: DocumentOrShadowRoot = element.ownerDocument;
  while (!pass && cursor.activeElement) {
    pass = cursor.activeElement === element;
    if (pass || !cursor.activeElement.shadowRoot) break;
    cursor = cursor.activeElement.shadowRoot;
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
              `  ${this.utils.printReceived(cursor.activeElement)}`,
            ]),
      ].join("\n");
    },
  };
};

declare module "vitest" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  interface Assertion<T = any> {
    /**
     * @description — Assert whether an element has focus or not, including shadow roots.
     *
     * @example
     *
     * <custom-element>
     *  <input slot="input" type="text" data-testid="element-to-focus" />
     * </custom-element>
     *
     * const input = getByTestId('element-to-focus')
     * input.focus()
     * expect(input).toHaveFocusDeep()
     * input.blur()
     * expect(input).not.toHaveFocusDeep()
     */
    toHaveFocusDeep(): void;
  }
}
