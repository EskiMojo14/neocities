import { getContentByRoute } from "@greenwood/cli/src/data/client.js";
import { html, LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { when } from "lit/directives/when.js";
import { getBlogPosts } from "../../data/index.ts";
import base from "../../styles/utility/baseline.css?type=raw";
import { frontmatterIsSet } from "../../utils/index.ts";
import "../date-format/date-format.ts";
import "../spinner/spinner.ts";
import "../tags/tags.ts";
import blogList from "./blog-list.css?type=raw";

const blogChildIcon = String(
  (await getContentByRoute("/blog/")).sort((a, b) =>
    a.route.localeCompare(b.route),
  )[0]?.data.childIcon,
);

const blogPosts = await getBlogPosts();

@customElement("blog-list")
export default class BlogList extends LitElement {
  static styles = [unsafeCSS(base), unsafeCSS(blogList)];

  @property({ type: String })
  tag = "${unset}";

  render() {
    const posts = frontmatterIsSet(this.tag)
      ? blogPosts.filter((post) => post.tags.includes(this.tag))
      : blogPosts;
    return html`
      <div class="blog-list">
        ${repeat(
          posts,
          (post) => post.route,
          (post, index) =>
            html`<div>
                <a href="${post.route}">
                  <div class="info">
                    <date-format
                      date="${post.published.slice(0, 10)}"
                    ></date-format>
                    <h3 class="headline6">${post.title}</h3>
                    <p class="subtitle2">${post.description}</p>
                  </div>
                  <material-symbol aria-hidden="true"
                    >${post.icon ?? blogChildIcon}</material-symbol
                  >
                </a>
                <tags-list path="blog" .tags=${post.tags}></tags-list>
              </div>
              ${when(
                index < blogPosts.length - 1,
                () => html`<hr class="inset" />`,
              )}`,
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
