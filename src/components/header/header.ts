import { html, LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { when } from "lit/directives/when.js";
import base from "../../styles/utility/baseline.css?type=raw";
import { frontmatterIsSet } from "../../utils/index.ts";
import { consolewriter } from "../../utils/lit.ts";
import "../console-writer/console-writer.ts";
import header from "./header.css?type=raw";

@customElement("page-header")
export default class PageHeader extends LitElement {
  static styles = [unsafeCSS(base), unsafeCSS(header)];

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
              html`<time datetime="${published.slice(1, -1)}">
                <span class="sr-only">Published:</span
                ><console-writer
                  text="${published.slice(1, 11)}"
                  delay=${subtitleDuration + headerDuration}
                ></console-writer>
              </time>`,
          )}
          <console-writer
            role="heading"
            aria-level="1"
            class="headline2"
            text="${header}"
          ></console-writer>
          ${when(
            frontmatterIsSet(subtitle),
            () => html`
              <console-writer
                role="paragraph"
                text="${subtitle}"
                delay=${headerDuration}
                class="headline5"
              ></console-writer>
            `,
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
