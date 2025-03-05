import { css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { html } from "lit-html";
import { typography } from "../../styles/typography.ts";
import { consolewriter } from "../../utils/lit.ts";

@customElement("page-header")
export class PageHeader extends LitElement {
  static styles = [
    typography.headline2,
    css`
      h1 {
        margin: 0;
      }
    `,
  ];

  @property({ type: Number })
  delay?: number;

  render() {
    const text = this.textContent ?? "";
    return html`
      <header>
        <h1 class="headline2" aria-label=${this.ariaLabel ?? text}>
          ${consolewriter(text, { delay: this.delay })}
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
