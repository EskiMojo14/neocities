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
  subtitle = "${unset}";

  @property({ type: String })
  published = "${unset}";

  render() {
    const { header, subtitle, published } = this;
    const headerDuration = consolewriter.getDuration(header);
    const subtitleDuration = consolewriter.getDuration(subtitle);
    return html`
      <header>
        <hgroup>
          ${when(
            frontmatterIsSet(published),
            () =>
              html`<span class="sr-only">Published:</span
                ><time datetime="${published.slice(1, -1)}" class="overline">
                  <span aria-hidden="true" class="text">
                    ${consolewriter(published.slice(1, 11), {
                      delay: subtitleDuration + headerDuration,
                    })}</span
                  >
                  ${published.slice(1, 11)}
                </time>`,
          )}
          <h1 class="headline2">
            <span aria-hidden="true" class="text"
              >${consolewriter(header)}</span
            >
            ${header}
          </h1>
          ${when(
            frontmatterIsSet(subtitle),
            () =>
              html`<p class="headline5">
                <span aria-hidden="true" class="text"
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
