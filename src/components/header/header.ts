import { css, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { html } from "lit-html";
import { when } from "lit-html/directives/when.js";
import { typography } from "../../styles/typography.ts";
import { consolewriter } from "../../utils/lit.ts";

@customElement("page-header")
export default class PageHeader extends LitElement {
  static styles = [
    typography.headline2,
    typography.headline5,
    css`
      h1 {
        margin: 0;
      }
    `,
  ];

  headerText = "";
  subtitleText = "";
  connectedCallback() {
    super.connectedCallback();
    let headerText = "";
    let subtitleText = "";
    if (this.hasChildNodes()) {
      for (const node of this.childNodes) {
        if (node instanceof HTMLElement && node.slot === "subtitle") {
          subtitleText += node.textContent?.trim() ?? "";
          continue;
        }
        headerText += node.textContent?.trim() ?? "";
      }
    }
    this.headerText = headerText;
    this.subtitleText = subtitleText;
  }

  render() {
    const { headerText, subtitleText } = this;
    return html`
      <header>
        <hgroup>
          <h1 class="headline2" aria-label=${this.ariaLabel ?? headerText}>
            ${consolewriter(headerText)}
          </h1>
          ${when(
            subtitleText,
            () => html`<p
              class="headline5"
              aria-label=${this.ariaLabel ?? subtitleText}
            >
              ${consolewriter(subtitleText, { delay: 1000 })}
            </p>`
          )}
        </hgroup>
      </header>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "page-header": PageHeader;
  }
}
