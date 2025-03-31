import { html, LitElement, unsafeCSS } from "lit";
import { customElement, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import * as v from "valibot";
import type { Case } from "../../../constants/prefs.ts";
import { casePref } from "../../../constants/prefs.ts";
import base from "../../../styles/utility/baseline.css?type=raw";
import { capitalize } from "../../../utils/index.ts";
import { toggleButton } from "../../button/toggle.ts";
import Tooltip from "../../tooltip/tooltip.ts";
import caseToggle from "./case-toggle.css?type=raw";

@customElement("case-toggle")
export default class CaseToggle extends LitElement {
  static styles = [unsafeCSS(base), unsafeCSS(caseToggle)];

  @state()
  currentCase: Case = casePref.fallback;

  connectedCallback() {
    super.connectedCallback();
    this.currentCase = v.parse(
      casePref.schema,
      document.documentElement.dataset[casePref.dataKey],
    );
  }

  setCase(newCase: Case) {
    document.documentElement.dataset[casePref.dataKey] = newCase;
    localStorage.setItem(casePref.storageKey, newCase);
    this.currentCase = newCase;
  }

  render() {
    return html`
      <fieldset
        class="button-group"
        @change=${(ev: Event) => {
          this.setCase((ev.target as HTMLInputElement).value as Case);
        }}
      >
        <legend class="sr-only">Case</legend>
        ${repeat(
          casePref.schema.options,
          (opt) => opt,
          (opt) =>
            toggleButton(
              html`<material-symbol aria-hidden="true"
                >${casePref.icons[opt]}</material-symbol
              >`,
              {
                className: "icon",
                ariaLabel: `${capitalize(opt)} case`,
                ref(el) {
                  if (el) Tooltip.lazy(el);
                },
                // input
                name: "case",
                value: opt,
                checked: opt === this.currentCase,
              },
            ),
        )}
      </fieldset>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "case-toggle": CaseToggle;
  }
}
