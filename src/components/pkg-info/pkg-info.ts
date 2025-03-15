import { html, LitElement, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { when } from "lit/directives/when.js";
import base from "../../styles/base.css?type=raw";
import dracula from "../../styles/themes/dracula.css?type=raw";
import githubLight from "../../styles/themes/github-light.css?type=raw";
import { frontmatterIsSet } from "../../utils/index.ts";
import "../link-group/link-group.ts";
import pkgInfo from "./pkg-info.css?type=raw";

@customElement("pkg-info")
export default class PkgInfo extends LitElement {
  static styles = [
    unsafeCSS(base),
    unsafeCSS(githubLight),
    unsafeCSS(dracula),
    unsafeCSS(pkgInfo),
  ];

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

  @state()
  theme = "dark";

  #retrieveTheme() {
    this.theme = document.documentElement.dataset.theme ?? "dark";
  }

  #observer =
    typeof MutationObserver === "undefined"
      ? null
      : new MutationObserver(() => {
          this.#retrieveTheme();
        });

  connectedCallback() {
    super.connectedCallback();
    this.#observer?.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
  }

  firstUpdated() {
    this.#retrieveTheme();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#observer?.disconnect();
  }

  render() {
    const { devDep, pkg, repo, docs, includeInstall } = this;
    return html`
      <div data-theme=${this.theme}>
        <link-group>
          ${when(
            frontmatterIsSet(docs) && docs,
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
        </link-group>
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
      </div>
    `;
  }
}
