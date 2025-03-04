import { LitElement, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { html } from "lit-html";
import { classMap } from "lit-html/directives/class-map.js";
import { styleMap, rtl } from "/utils/lit.ts";

@customElement("material-symbol")
export class MaterialSymbol extends LitElement {
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
        "GRAD" clamp(-25, var(--icon-grade, 0), 200),
        "opsz" clamp(20, var(--icon-optical-size, 24), 48);
      --transition-duration: 250ms;
      transition: font-variation-settings var(--transition-duration);
      ${rtl(css`
        &.flip-rtl {
          transform: scaleX(-1);
        }
      `)};
    }
  `;

  @property({ type: Number })
  size = 24;

  @property({ type: Boolean })
  fill = false;

  @property({ type: Number })
  weight = 400 as 100 | 200 | 300 | 400 | 500 | 600 | 700;

  @property({ type: Number })
  grade = 0;

  @property({ type: Number })
  opticalSize?: number;

  @property({ type: Boolean, attribute: "flip-rtl" })
  flipRtl = false;

  render() {
    return html`
      <i
        class=${classMap({
          "flip-rtl": this.flipRtl,
        })}
        style=${styleMap({
          "--icon-size": `${this.size}px`,
          "--icon-fill": this.fill ? 1 : 0,
          "--icon-weight": this.weight,
          "--icon-grade": this.grade,
          "--icon-optical-size": this.opticalSize ?? this.size,
        })}
      >
        ${this.childNodes}
      </i>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    console.log(this.childNodes);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "material-symbol": MaterialSymbol;
  }
}
