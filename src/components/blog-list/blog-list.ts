import { html, LitElement, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { until } from "lit/directives/until.js";
import { when } from "lit/directives/when.js";
import type { BlogPost } from "../../data/index.ts";
import { getBlogPosts } from "../../data/index.ts";
import base from "../../styles/base.css?type=raw";
import typography from "../../styles/typography.css?type=raw";
import "../spinner/spinner.ts";
import blogList from "./blog-list.css?type=raw";

@customElement("blog-list")
export default class BlogList extends LitElement {
  static styles = [unsafeCSS(base), unsafeCSS(typography), unsafeCSS(blogList)];

  #_blogPosts: Array<BlogPost> | undefined;
  async #getBlogPosts() {
    return (this.#_blogPosts ??= await getBlogPosts());
  }

  render() {
    return html`
      <div class="blog-list">
        ${until(
          this.#getBlogPosts().then((blogPosts) =>
            repeat(
              blogPosts,
              (post) => post.route,
              (post, index) =>
                html`<a href="${post.route}">
                    <div class="info">
                      <time datetime="${post.published}" class="overline">
                        ${post.published.slice(0, 10)}
                      </time>
                      <h3 class="headline6">${post.title}</h3>
                      <p class="subtitle2">${post.description}</p>
                    </div>
                    <material-symbol aria-hidden="true"
                      >${post.icon ?? "article"}</material-symbol
                    >
                  </a>
                  ${when(index < blogPosts.length - 1, () => html`<hr />`)}`,
            ),
          ),
          html`<hourglass-spinner></hourglass-spinner>`,
        )}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "blog-list": BlogList;
  }
}
