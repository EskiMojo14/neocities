import { html, LitElement, nothing, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import * as v from "valibot";
import base from "../../styles/utility/baseline.css?type=raw";
import typography from "../../styles/utility/typography.css?type=raw";
import { slugify } from "../../utils/index.ts";
import * as vUtils from "../../utils/valibot.ts";

const tagsSchema = v.array(v.string());
const maybeJsonSchema = v.union([tagsSchema, vUtils.json(tagsSchema)]);

@customElement("tags-list")
export default class Tags extends LitElement {
  static styles = [unsafeCSS(base), unsafeCSS(typography)];

  @property({ type: String })
  path = "";

  @property({ type: String })
  tags: Array<string> | string = [];

  render() {
    const parsed = v.safeParse(maybeJsonSchema, this.tags);
    if (!parsed.success || !parsed.output.length) return nothing;
    return html`
      <p class="caption">
        Tags:
        ${repeat(
          parsed.output,
          (tag, idx) => `${tag}-${idx === 0 ? "first" : "other"}`,
          (tag, idx) =>
            idx > 0
              ? html`, <a href="/${this.path}/tags/${slugify(tag)}/">${tag}</a>`
              : html`<a href="/${this.path}/tags/${slugify(tag)}/">${tag}</a>`,
        )}
      </p>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "tags-list": Tags;
  }
}
