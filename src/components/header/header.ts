import { html, LitElement, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { when } from "lit/directives/when.js";
import * as v from "valibot";
import type { Style } from "../../constants/prefs.ts";
import { stylePref } from "../../constants/prefs.ts";
import base from "../../styles/utility/baseline.css?type=raw";
import { dateFormat, frontmatterIsSet } from "../../utils/index.ts";
import { cache, consolewriter } from "../../utils/lit.ts";
import * as vUtils from "../../utils/valibot.ts";
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

  @cache(({ published }) => [published])
  get formattedPublished() {
    if (!frontmatterIsSet(this.published)) return "";
    return dateFormat.format(
      v.parse(vUtils.coerceDate, this.published.slice(1, -1)),
    ); // double quoted for some reason
  }

  @state()
  pageStyle: Style = stylePref.fallback;

  eventAc: AbortController | undefined;

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener(
      "stylechange",
      (e) => (this.pageStyle = e.newStyle),
      {
        signal: (this.eventAc = new AbortController()).signal,
      },
    );
  }
  firstUpdated() {
    this.pageStyle = stylePref.data;
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.eventAc?.abort();
  }

  render() {
    const { header, subtitle, published, formattedPublished, pageStyle } = this;
    const headerDuration = consolewriter.getDuration(header);
    const subtitleDuration = consolewriter.getDuration(subtitle);
    return html`
      <header>
        <hgroup>
          ${when(
            formattedPublished,
            () =>
              html`<time date="${published.slice(1, -1)}">
                <span class="sr-only">Published:</span
                ><console-writer
                  text="${pageStyle === "normal"
                    ? formattedPublished
                    : published.slice(1, 11)}"
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
