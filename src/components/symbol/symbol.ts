import { LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { html } from "lit-html";
import { classMap } from "lit-html/directives/class-map.js";
import symbol from "./symbol.css" with { type: "css" };
import base from "../../styles/base.css" with { type: "css" };

@customElement("material-symbol")
export default class MaterialSymbol extends LitElement {
  static styles = [base, symbol];

  @property({ type: Boolean, attribute: "flip-rtl" })
  flipRtl = false;

  render() {
    return html`
      <i
        aria-hidden="true"
        class=${classMap({
          "flip-rtl": this.flipRtl,
        })}
      >
        <slot></slot>
      </i>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "material-symbol": MaterialSymbol;
  }
}
