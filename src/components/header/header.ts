import { html, css, LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { when } from "lit/directives/when.js";
import base from "../../styles/base.css?type=raw";
import typography from "../../styles/typography.css?type=raw";
import { frontmatterIsSet } from "../../utils/index.ts";
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

  @property({ type: String })
  header = "";

  @property({ type: String })
  subtitle = "";

  render() {
    const { header, subtitle } = this;
    const headerDuration = Math.min(1000, 100 * header.length) + 300;
    return html`
      <header>
        <hgroup>
          <h1 class="headline2" aria-label=${header}>
            ${consolewriter(header)}
          </h1>
          ${when(
            frontmatterIsSet(subtitle),
            () =>
              html`<p class="headline5" aria-label=${subtitle}>
                ${consolewriter(subtitle, { delay: headerDuration })}
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
