import { html, LitElement, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { when } from "lit/directives/when.js";
import { installCommands, type PackageManager } from "../../constants/prefs.ts";
import base from "../../styles/base.css?type=raw";
import dracula from "../../styles/themes/dracula.css?type=raw";
import githubLight from "../../styles/themes/github-light.css?type=raw";
import typography from "../../styles/typography.css?type=raw";
import { frontmatterIsSet } from "../../utils/index.ts";
import "../focus-group/focus-group.ts";
import { toast } from "../toaster/toaster.ts";
import pkgInfo from "./pkg-info.css?type=raw";

@customElement("pkg-info")
export default class PkgInfo extends LitElement {
  static styles = [
    unsafeCSS(base),
    unsafeCSS(typography),
    unsafeCSS(githubLight),
    unsafeCSS(dracula),
    unsafeCSS(pkgInfo),
  ];

  @property({ type: String, attribute: "dev-dep" })
  devDep = "${unset}";

  @property({ type: String })
  pkg = "";

  @property({ type: String })
  repo = "";

  @property({ type: String })
  docs = "${unset}";

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

  @state()
  packageManager: PackageManager = "pnpm";

  #retrievePackageManager() {
    this.packageManager =
      (document.documentElement.dataset.pm as PackageManager | undefined) ??
      "pnpm";
  }

  #setPackageManager(newValue: PackageManager) {
    this.packageManager = newValue;
    document.documentElement.dataset.pm = newValue;
    localStorage.setItem("packageManager", newValue);
  }

  firstUpdated() {
    this.#retrieveTheme();
    this.#retrievePackageManager();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#observer?.disconnect();
  }

  async #onCopy() {
    try {
      const text =
        this.shadowRoot?.getElementById("install-command")?.textContent;
      if (!text) return;
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard", true);
    } catch (e) {
      console.error("Failed to copy to clipboard", e);
    }
  }

  render() {
    const { devDep, pkg, repo, docs, includeInstall, packageManager } = this;
    return html`
      <div data-theme=${this.theme}>
        <focus-group>
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
        </focus-group>
        ${when(
          includeInstall,
          () => html`
            <div class="install">
              <fieldset
                class="install-buttons"
                @change=${(ev: Event) => {
                  this.#setPackageManager(
                    (ev.target as HTMLInputElement).value as PackageManager,
                  );
                }}
              >
                <legend class="sr-only">Install with</legend>
                ${repeat(
                  Object.keys(installCommands),
                  (key) => key,
                  (key) => html`
                    <input
                      type="radio"
                      class="button"
                      name="package-manager"
                      value=${key}
                      aria-label="Install with ${key}"
                      ?checked=${this.packageManager === key}
                    />
                  `,
                )}
              </fieldset>
              <div class="command">
                <pre
                  class="language-bash"
                  id="install-command"
                ><code class="language-bash"><span class="token function">${packageManager}</span> <span class="token function">${installCommands[
                  packageManager
                ]}</span> ${when(
                  frontmatterIsSet(devDep),
                  () => html`<span class="token parameter variable">-D</span> `,
                )}${pkg}</code></pre>
                <button
                  class="icon"
                  title="Copy to clipboard"
                  @click=${() => this.#onCopy()}
                >
                  <material-symbol aria-hidden="true"
                    >content_copy</material-symbol
                  >
                </button>
              </div>
            </div>
          `,
        )}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "pkg-info": PkgInfo;
  }
}
