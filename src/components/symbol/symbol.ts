import { LitElement, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { html } from "lit-html";
import { classMap } from "lit-html/directives/class-map.js";

@customElement("material-symbol")
export default class MaterialSymbol extends LitElement {
  static styles = css`
    i {
      font-family: var(--font-family-icon);
      font-weight: normal;
      font-style: normal;
      line-height: 1;
      letter-spacing: normal;
      text-transform: none;
      display: inline-block;
      white-space: nowrap;
      word-wrap: normal;
      direction: ltr;
      -webkit-font-feature-settings: "liga";
      font-feature-settings: "liga";
      -webkit-font-smoothing: antialiased;
      text-rendering: optimizeLegibility;

      font-size: var(--icon-size, 24px);
      font-variation-settings: "FILL" var(--icon-fill, 0),
        "wght" var(--icon-weight, 400),
        "GRAD" clamp(-25, var(--icon-grade, -25), 200),
        "opsz" clamp(20, var(--icon-optical-size, 24), 48);
      transition: font-variation-settings var(--font-transition-duration);
      &:dir(rtl) {
        &.flip-rtl {
          transform: scaleX(-1);
        }
      }
    }
  `;

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
