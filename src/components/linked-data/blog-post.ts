import { html, LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { BlogPosting } from "schema-dts";
import base from "../../styles/utility/baseline.css?type=raw";
import { excludeUnsetFrontmatter } from "../../utils/index.ts";
import "../json-ld/json-ld.ts";

@customElement("blog-post-ld")
export default class BlogPostLd extends LitElement {
  static styles = [unsafeCSS(base)];

  @property({ type: String })
  title = "${unset}";

  @property({ type: String })
  description = "${unset}";

  @property({ type: String })
  published = "${unset}";

  @property({ type: String })
  url = "${unset}";

  render() {
    return html`<json-ld
      .data=${{
        "@type": "BlogPosting",
        "@id": excludeUnsetFrontmatter(this.url),
        headline: excludeUnsetFrontmatter(this.title),
        author: "eskimojo",
        description: excludeUnsetFrontmatter(this.description),
        datePublished: excludeUnsetFrontmatter(this.published)?.slice(1, -1),
        url: excludeUnsetFrontmatter(this.url),
        image: "https://eskimojo.neocities.org/assets/icon.png",
      } satisfies BlogPosting}
    ></json-ld>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "blog-post-ld": BlogPostLd;
  }
}
