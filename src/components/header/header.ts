import { css, LitElement, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";
import { html } from "lit-html";
import { when } from "lit-html/directives/when.js";
import base from "../../styles/base.css?type=raw";
import typography from "../../styles/typography.css?type=raw";
import { consolewriter } from "../../utils/lit.ts";

@customElement("page-header")
export default class PageHeader extends LitElement {
  static styles = [
    unsafeCSS(base),
    unsafeCSS(typography),
    css`
      h1,
      p {
        margin: 0;
      }
      p {
        margin-top: 0.5em;
        min-height: 1.15em;
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
          <h1 class="headline2" aria-label=${headerText}>
            ${consolewriter(headerText)}
          </h1>
          ${when(
            subtitleText,
            () =>
              html`<p class="headline5" aria-label=${subtitleText}>
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
