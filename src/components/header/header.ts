import { css, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { html } from "lit-html";
import { typewriter } from "../../utils/index.ts";
import { asyncReplace } from "../../utils/lit.ts";

@customElement("page-header")
export class PageHeader extends LitElement {
  static styles = css`
    h1 {
      font-size: var(--headline2);
      font-weight: var(--weight-regular);
      margin: 0;
    }
  `;
  render() {
    const text = this.textContent ?? "";
    return html`
      <header>
        <h1 aria-label=${this.ariaLabel ?? text}>
          ${asyncReplace(
            typewriter(text),
            (value, idx) => value + (idx === text.length - 1 ? "▯" : "▮")
          )}
        </h1>
      </header>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "page-header": PageHeader;
  }
}
