import { LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { html } from "lit-html";
import { when } from "lit-html/directives/when.js";
import { frontmatterIsSet } from "../../utils/index.ts";

@customElement("pkg-info")
export default class PkgInfo extends LitElement {
  createRenderRoot() {
    return this;
  }

  @property({ type: String, attribute: "dev-dep" })
  devDep = "";

  @property({ type: String })
  pkg = "";

  @property({ type: String })
  repo = "";

  @property({ type: String })
  docs = "";

  @property({ type: Boolean, attribute: "include-install" })
  includeInstall = false;

  render() {
    const { devDep, pkg, repo, docs, includeInstall } = this;
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
      ${when(
        includeInstall,
        () => html`
          <pre
            class="language-bash"
          ><code class="language-bash"><span class="token function">pnpm</span> <span class="token function">add</span> ${when(
            frontmatterIsSet(devDep),
            () => html`<span class="token parameter variable">-D</span> `,
          )}${pkg}</code></pre>
        `,
      )}
    `;
  }
}
