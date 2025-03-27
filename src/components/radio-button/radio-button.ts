import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import type { RefOrCallback } from "lit/directives/ref.js";
import { ref } from "lit/directives/ref.js";
import { safeAssign } from "../../utils/index.ts";

interface RadioButton extends Partial<HTMLInputElement> {
  labelAttributes?: Partial<HTMLLabelElement>;
  ref?: RefOrCallback;
}

// can't use shadow DOM since radio buttons need to be in the same form
// can't use light DOM since lit SSR doesn't support it
// thus, factory
export function radioButton(
  content: unknown,
  {
    name,
    value,
    id = `${name}-${value}`,
    labelAttributes,
    className,
    ref: refCallback,
    ...opts
  }: RadioButton,
) {
  return html`
    <radio-button class=${ifDefined(className)} ${ref(refCallback)}>
      <input
        type="radio"
        ${ref(
          (input) =>
            input &&
            safeAssign(input as HTMLInputElement, opts, { name, value, id }),
        )}
        @focus=${(e: FocusEvent) => {
          const input = e.target as HTMLInputElement;
          input.parentElement?.dispatchEvent(new FocusEvent("focus"));
        }}
        class="sr-only"
      />
      <label
        for=${id}
        id=${`${id}-label`}
        ${ref(
          (label) =>
            label && labelAttributes && safeAssign(label, labelAttributes),
        )}
        >${content}</label
      >
    </radio-button>
  `;
}
