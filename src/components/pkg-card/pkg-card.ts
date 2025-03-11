import { LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { html } from "lit-html";
import base from "../../styles/base.css?type=raw";
import typography from "../../styles/typography.css?type=raw";
import "../pkg-info/pkg-info.ts";
import pkgCard from "./pkg-card.css?type=raw";

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
  title = "";

  @property({ type: String })
  description = "";

  render() {
    const { pkg, repo, docs, title, description } = this;
    return html`
      <div class="pkg-card">
        <code class="overline">${pkg}</code>
        <a class="headline5" href="/packages/${pkg}">${title}</a>
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
