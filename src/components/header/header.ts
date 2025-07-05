import { html, LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { when } from "lit/directives/when.js";
import * as v from "valibot";
import { withStyle } from "../../mixins/page-style.ts";
import base from "../../styles/utility/baseline.css?type=raw";
import { dateFormat, frontmatterIsSet } from "../../utils/index.ts";
import { cache, consolewriter } from "../../utils/lit.ts";
import * as vUtils from "../../utils/valibot.ts";
import "../console-writer/console-writer.ts";
import header from "./header.css?type=raw";

const publishedSchema = vUtils.json(vUtils.coerceDate);

@customElement("page-header")
export default class PageHeader extends withStyle(LitElement) {
  static styles = [unsafeCSS(base), unsafeCSS(header)];

  @property({ type: String })
  header = "";

  @property({ type: String })
  subtitle = "${unset}";

  @property({ type: String })
  published = "${unset}";

  @cache(({ published }) => [published])
  get publishedDate() {
    if (!frontmatterIsSet(this.published)) return undefined;
    return v.parse(publishedSchema, this.published);
  }

  @cache(({ publishedDate }) => [publishedDate])
  get publishedLabel() {
    return this.publishedDate ? dateFormat(this.publishedDate, "normal") : "";
  }

  @cache(({ publishedDate, pageStyle }) => [publishedDate, pageStyle])
  get formattedPublished() {
    if (!this.publishedDate) return "";
    return dateFormat(this.publishedDate, this.pageStyle);
  }

  render() {
    const { header, subtitle, published, publishedLabel, formattedPublished } =
      this;
    const headerDuration = consolewriter.getDuration(header);
    const subtitleDuration = consolewriter.getDuration(subtitle);
    return html`
      <header>
        <hgroup>
          ${when(
            formattedPublished,
            () =>
              html`<time datetime="${JSON.parse(published)}">
                <span class="sr-only">Published: </span>
                <console-writer
                  text="${formattedPublished}"
                  delay=${subtitleDuration + headerDuration}
                  aria-label="${publishedLabel}"
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
