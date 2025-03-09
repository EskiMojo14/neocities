import { LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { html } from "lit-html";
import { when } from "lit-html/directives/when.js";
import dracula from "../../../node_modules/dracula-prism/dist/css/dracula-prism.css?type=raw";
import base from "../../styles/base.css?type=raw";
import { frontmatterIsSet } from "../../utils/index.ts";
import pkgInfo from "./pkg-info.css?type=raw";

@customElement("pkg-info")
export default class PkgInfo extends LitElement {
  static styles = [unsafeCSS(dracula), unsafeCSS(base), unsafeCSS(pkgInfo)];

  @property({ type: String, attribute: "dev-dep" })
  devDep = "";

  @property({ type: String })
  pkg = "";

  @property({ type: String })
  repo = "";

  @property({ type: String })
  docs = "";

  render() {
    const { devDep, pkg, repo, docs } = this;
    return html`
      <div class="link-group">
        ${when(
          frontmatterIsSet(docs),
          () => html`
            <a href="${docs}" target="_blank" rel="noopener noreferrer">
              <material-symbol aria-hidden="true"
                >developer_guide</material-symbol
              >
              Docs
            </a>
            |
          `,
        )}
        <a
          href="https://www.npmjs.com/package/${pkg}"
          target="_blank"
          rel="noopener noreferrer"
        >
          <material-symbol aria-hidden="true">deployed_code</material-symbol>
          NPM
        </a>
        |
        <a
          href="https://github.com/${repo}"
          target="_blank"
          rel="noopener noreferrer"
        >
          <material-symbol aria-hidden="true">code</material-symbol>
          GitHub
        </a>
      </div>
      <pre
        class="language-bash"
      ><code class="language-bash"><span class="token function">pnpm</span> <span class="token function">add</span> ${when(
        frontmatterIsSet(devDep),
        () => html`<span class="token parameter variable">-D</span> `,
      )}${pkg}</code></pre>
    `;
  }
}
