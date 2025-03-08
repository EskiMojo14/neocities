import { css, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { html } from "lit-html";
import { when } from "lit-html/directives/when.js";
import { consolewriter } from "../../utils/lit.ts";
import base from "../../styles/base.css" with { type: "css" };
import typography from "../../styles/typography.css" with { type: "css" };

@customElement("page-header")
export default class PageHeader extends LitElement {
  static styles = [
    base,
    typography,
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

    let header: ChildNode | null = null;
    let subtitle: Element | null = null;
    for (const node of this.childNodes) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
        header = node;
        continue;
      } else if (node instanceof Element && node.slot === "subtitle") {
        subtitle = node;
        continue;
      }
    }
    this.headerText = header?.textContent?.trim() ?? "";
    this.subtitleText = subtitle?.textContent?.trim() ?? "";
  }

  render() {
    const { headerText, subtitleText } = this;
    const headerDuration = Math.min(1000, 100 * headerText.length) + 300;
    return html`
      <header>
        <hgroup>
          <h1 class="headline2" aria-label=${this.ariaLabel ?? headerText}>
            ${consolewriter(headerText)}
          </h1>
          ${when(
            subtitleText,
            () =>
              html`<p
                class="headline5"
                aria-label=${this.ariaLabel ?? subtitleText}
              >
                ${consolewriter(subtitleText, { delay: headerDuration })}
              </p>`,
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
