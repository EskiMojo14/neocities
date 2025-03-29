import { html, LitElement, nothing, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import * as v from "valibot";
import base from "../../styles/utility/baseline.css?type=raw";
import { slugify } from "../../utils/index.ts";
import { cache } from "../../utils/lit.ts";
import * as vUtils from "../../utils/valibot.ts";

const tagsSchema = vUtils.maybeJson(v.array(v.string()));

@customElement("tags-list")
export default class Tags extends LitElement {
  static styles = [unsafeCSS(base)];

  @property({ type: String })
  path = "";

  @property({ type: String })
  tags: Array<string> | string = [];

  @cache(({ tags }) => [tags])
  get parsedTags() {
    return v.safeParse(tagsSchema, this.tags);
  }

  render() {
    const { parsedTags } = this;
    if (!parsedTags.success || !parsedTags.output.length) return nothing;
    return html`
      <p class="caption">
        Tags:
        ${repeat(
          parsedTags.output,
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
