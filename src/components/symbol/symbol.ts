import { LitElement, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { html } from "lit-html";
import { classMap } from "lit-html/directives/class-map.js";
import { styleMap, selectors } from "/utils/lit.ts";

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
        "GRAD" clamp(-25, var(--icon-grade, -25), 200),
        "opsz" clamp(20, var(--icon-optical-size, 24), 48);
      --transition-duration: 250ms;
      transition: font-variation-settings var(--transition-duration);
      ${selectors.rtl} {
        &.flip-rtl {
          transform: scaleX(-1);
        }
      }
    }
  `;

  @property({ type: Number })
  size?: number;

  @property({ type: Boolean })
  fill?: boolean;

  @property({ type: Number })
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;

  @property({ type: Number })
  grade?: number;

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
          "--icon-size":
            typeof this.size === "number" ? `${this.size}px` : undefined,
          "--icon-fill":
            typeof this.fill === "boolean" ? Number(this.fill) : undefined,
          "--icon-weight": this.weight,
          "--icon-grade": this.grade,
          "--icon-optical-size": this.opticalSize ?? this.size,
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
