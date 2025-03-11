import { LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { html } from "lit-html";
import "../pkg-info/pkg-info.ts";

@customElement("pkg-card")
export default class PkgCard extends LitElement {
  createRenderRoot() {
    return this;
  }

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
