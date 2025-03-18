import { getContentByRoute } from "@greenwood/cli/src/data/client.js";
import { html, LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import base from "../../styles/base.css?type=raw";
import typography from "../../styles/typography.css?type=raw";
import "../pkg-info/pkg-info.ts";
import pkgCard from "./pkg-card.css?type=raw";

const pkgChildIcon = String(
  (await getContentByRoute("/packages/")).sort((a, b) =>
    a.route.localeCompare(b.route),
  )[0].data.childIcon,
);

@customElement("pkg-card")
export default class PkgCard extends LitElement {
  static styles = [unsafeCSS(base), unsafeCSS(typography), unsafeCSS(pkgCard)];

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

  render() {
    const { pkg, repo, docs, name, description, route, icon } = this;
    return html`
      <div class="pkg-card">
        <code class="overline">${pkg}</code>
        <a class="name" href="${route}">
          <h3 class="headline5">${name}</h3>
          <material-symbol aria-hidden="true">${icon}</material-symbol>
        </a>
        <p class="subtitle2">${description}</p>
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
