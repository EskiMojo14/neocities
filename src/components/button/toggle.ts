import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import type { RefOrCallback } from "lit/directives/ref.js";
import { ref } from "lit/directives/ref.js";
import { safeAssign } from "../../utils/index.ts";

export interface ToggleButton extends Partial<HTMLInputElement> {
  labelAttributes?: Partial<HTMLLabelElement>;
  ref?: RefOrCallback;
  type?: "radio" | "checkbox";
}

// can't use shadow DOM since radio buttons need to be in the same form
// can't use light DOM since lit SSR doesn't support it
// thus, factory
export function toggleButton(
  content: unknown,
  {
    type = "radio",
    name,
    value,
    id = `${name}-${value}`,
    labelAttributes,
    className,
    ref: refCallback,
    ...opts
  }: ToggleButton,
) {
  return html`
    <toggle-button class=${ifDefined(className)} ${ref(refCallback)}>
      <input
        type=${type}
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
    </toggle-button>
  `;
}
