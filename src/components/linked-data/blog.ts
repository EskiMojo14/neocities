import { getContentByRoute } from "@greenwood/cli/src/data/client.js";
import { html, LitElement, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";
import type { Blog } from "schema-dts";
import * as v from "valibot";
import base from "../../styles/utility/baseline.css?type=raw";
import "./json-ld.ts";

const blogPage = (await getContentByRoute("/blog/")).find(
  (page) => page.route === "/blog/",
);

const dataSchema = v.object({
  description: v.string(),
});

@customElement("blog-ld")
export default class BlogLd extends LitElement {
  static styles = [unsafeCSS(base)];

  render() {
    if (!blogPage) {
      throw new Error("Blog page not found");
    }
    const parsedData = v.parse(dataSchema, blogPage.data);

    return html`<json-ld
      .data=${{
        "@type": "Blog",
        "@id": blogPage.route,
        name: "eskimojo's Blog",
        description: parsedData.description,
        url: blogPage.route,
        image: "https://eskimojo.neocities.org/assets/icon.png",
      } satisfies Blog}
    ></json-ld>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "blog-ld": BlogLd;
  }
}
