import { html, LitElement, unsafeCSS } from "lit";
import { customElement, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import type { Style } from "../../../constants/prefs.ts";
import { stylePref } from "../../../constants/prefs.ts";
import { capitalize } from "../../../utils/index.ts";
import { toggleButton } from "../../button/toggle.ts";
import base from "../../styles/utility/baseline.css?type=raw";
import Tooltip from "../../tooltip/tooltip.ts";
import styleToggle from "./style-toggle.css?type=raw";

export class StyleChangeEvent extends Event {
  newStyle: Style;
  constructor(newStyle: Style) {
    super("stylechange", { bubbles: true, composed: true });
    this.newStyle = newStyle;
  }
}

@customElement("style-toggle")
export default class StyleToggle extends LitElement {
  static styles = [unsafeCSS(base), unsafeCSS(styleToggle)];

  @state()
  currentStyle: Style = stylePref.fallback;

  connectedCallback() {
    super.connectedCallback();
    this.currentStyle = stylePref.data;
  }

  setStyle(newStyle: Style) {
    this.currentStyle = stylePref.data = stylePref.storage = newStyle;
    this.dispatchEvent(new StyleChangeEvent(newStyle));
  }

  render() {
    return html`
      <fieldset
        class="button-group"
        @change=${(ev: Event) => {
          this.setStyle((ev.target as HTMLInputElement).value as Style);
        }}
      >
        <legend class="sr-only">Style</legend>
        ${repeat(
          stylePref.options,
          (opt) => opt,
          (opt) =>
            toggleButton(
              html`<material-symbol aria-hidden="true"
                >${stylePref.meta[opt].icon}</material-symbol
              >`,
              {
                className: "icon",
                ariaLabel: `${capitalize(opt)} style`,
                ref(el) {
                  if (el) Tooltip.lazy(el);
                },
                // input
                name: "style",
                value: opt,
                checked: opt === this.currentStyle,
              },
            ),
        )}
      </fieldset>
    `;
  }
}

declare global {
  interface GlobalEventHandlersEventMap {
    stylechange: StyleChangeEvent;
  }
  interface HTMLElementTagNameMap {
    "style-toggle": StyleToggle;
  }
}
