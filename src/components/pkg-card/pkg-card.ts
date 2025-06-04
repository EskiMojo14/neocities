import { getContentByRoute } from "@greenwood/cli/src/data/client.js";
import { html, LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import base from "../../styles/utility/baseline.css?type=raw";
import "../linked-data/package.ts";
import "../pkg-info/pkg-info.ts";
import "../tags/tags.ts";
import pkgCard from "./pkg-card.css?type=raw";

const pkgChildIcon = String(
  (await getContentByRoute("/packages/")).sort((a, b) =>
    a.route.localeCompare(b.route),
  )[0]?.data.childIcon,
);

@customElement("pkg-card")
export default class PkgCard extends LitElement {
  static styles = [unsafeCSS(base), unsafeCSS(pkgCard)];

  @property({ type: String })
  pkg = "";

  @property({ type: String })
  repo = "";

  @property({ type: String })
  docs = "";

  @property({ type: String })
  name = "";

  @property({ type: String })
  description = "";

  @property({ type: String })
  route = "";

  @property({ type: String })
  icon = pkgChildIcon;

  @property({ type: Array })
  tags: Array<string> = [];

  render() {
    const { pkg, repo, docs, name, description, route, icon } = this;
    return html`
      <div class="pkg-card">
        <pkg-ld
          pkg="${pkg}"
          repo="${repo}"
          docs="${docs}"
          name="${name}"
          description="${description}"
          route="${route}"
        ></pkg-ld>
        <code class="overline">${pkg}</code>
        <a class="name" href="${route}">
          <h3 class="headline5">${name}</h3>
          <material-symbol aria-hidden="true">${icon}</material-symbol>
        </a>
        <p class="subtitle2">${description}</p>
        <tags-list path="packages" .tags=${this.tags}></tags-list>
        <pkg-info pkg=${pkg} repo=${repo} docs=${docs}></pkg-info>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "pkg-card": PkgCard;
  }
}
