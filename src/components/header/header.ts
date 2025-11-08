import { html, LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { when } from "lit/directives/when.js";
import { StyleWatcher } from "../../mixins/style-watcher.ts";
import base from "../../styles/utility/baseline.css?type=raw";
import { frontmatterIsSet } from "../../utils/index.ts";
import { consolewriter } from "../../utils/lit.ts";
import "../console-writer/console-writer.ts";
import header from "./header.css?type=raw";

/** View transition duration in ms. */
const transitionDuration = 250;

@customElement("page-header")
export default class PageHeader extends StyleWatcher(LitElement) {
  static styles = [unsafeCSS(base), unsafeCSS(header)];

  @property({ type: String })
  header = "";

  @property({ type: String })
  subtitle = "${unset}";

  render() {
    const { header, subtitle } = this;
    const headerDuration = consolewriter.getDuration(header);
    return html`
      <header>
        <hgroup>
          <console-writer
            role="heading"
            aria-level="1"
            class="headline2"
            text="${header}"
            delay=${transitionDuration}
          ></console-writer>
          ${when(
            frontmatterIsSet(subtitle),
            () => html`
              <console-writer
                text="${subtitle}"
                delay=${headerDuration + transitionDuration}
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
