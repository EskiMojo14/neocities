import { html, LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { when } from "lit/directives/when.js";
import base from "../../styles/base.css?type=raw";
import typography from "../../styles/typography.css?type=raw";
import { frontmatterIsSet } from "../../utils/index.ts";
import { consolewriter } from "../../utils/lit.ts";
import header from "./header.css?type=raw";

@customElement("page-header")
export default class PageHeader extends LitElement {
  static styles = [unsafeCSS(base), unsafeCSS(typography), unsafeCSS(header)];

  @property({ type: String })
  header = "";

  @property({ type: String })
  subtitle = "";

  @property({ type: String })
  published = "";

  render() {
    const { header, subtitle, published } = this;
    const headerDuration = Math.min(1000, 100 * header.length) + 300;
    return html`
      <header>
        <hgroup>
          <span class="sr-only">Published:</span>
          ${when(
            frontmatterIsSet(published),
            () =>
              html`<time datetime="${published.slice(1, -1)}" class="overline">
                ${published.slice(1, 11)}
              </time>`,
          )}
          <h1 class="headline2">
            <span aria-hidden="true">${consolewriter(header)}</span>
            ${header}
          </h1>
          ${when(
            frontmatterIsSet(subtitle),
            () =>
              html`<p class="headline5">
                <span aria-hidden="true"
                  >${consolewriter(subtitle, { delay: headerDuration })}</span
                >
                ${subtitle}
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
