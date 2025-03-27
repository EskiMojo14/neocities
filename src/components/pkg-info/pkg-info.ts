import { html, LitElement, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { when } from "lit/directives/when.js";
import * as v from "valibot";
import type { PackageManager, Theme } from "../../constants/prefs.ts";
import {
  installCommands,
  pkgManagerSchema,
  themeSchema,
} from "../../constants/prefs.ts";
import dracula from "../../styles/themes/dracula.css?type=raw";
import githubLight from "../../styles/themes/github-light.css?type=raw";
import base from "../../styles/utility/baseline.css?type=raw";
import { frontmatterIsSet } from "../../utils/index.ts";
import "../focus-group/focus-group.ts";
import { radioButton } from "../radio-button/radio-button.ts";
import { toast } from "../toaster/toaster.ts";
import Tooltip from "../tooltip/tooltip.ts";
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
  theme: Theme = themeSchema.fallback;

  eventAc: AbortController | undefined;

  #retrieveTheme() {
    this.theme = v.parse(themeSchema, document.documentElement.dataset.theme);
  }

  connectedCallback() {
    super.connectedCallback();
    this.eventAc = new AbortController();
    document.addEventListener("themechange", (e) => (this.theme = e.newTheme), {
      signal: this.eventAc.signal,
    });
  }

  @state()
  packageManager: PackageManager = pkgManagerSchema.fallback;

  #retrievePackageManager() {
    this.packageManager = v.parse(
      pkgManagerSchema,
      document.documentElement.dataset.pm,
    );
  }

  #setPackageManager(newValue: PackageManager) {
    this.packageManager = newValue;
    document.documentElement.dataset.pm = newValue;
    localStorage.setItem("packageManager", newValue);
  }

  firstUpdated() {
    this.#retrieveTheme();
    this.#retrievePackageManager();
    Tooltip.for(
      this.shadowRoot,
      "copy-install-to-clipboard",
      "Copy to clipboard",
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.eventAc?.abort();
  }

  async #onCopy() {
    try {
      const text =
        this.shadowRoot?.getElementById("install-command")?.textContent;
      if (!text) return;
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard", true);
    } catch (e) {
      toast.error("Failed to copy to clipboard", true);
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
                class="radio-button-group install-buttons"
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
                  (key) =>
                    radioButton(key, {
                      name: "package-manager",
                      value: key,
                      checked: this.packageManager === key,
                      labelAttributes: {
                        ariaLabel: `Install with ${key}`,
                      },
                    }),
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
                  id="copy-install-to-clipboard"
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
