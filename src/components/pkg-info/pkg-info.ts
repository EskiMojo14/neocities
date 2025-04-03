import { html, LitElement, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ref } from "lit/directives/ref.js";
import { repeat } from "lit/directives/repeat.js";
import { when } from "lit/directives/when.js";
import type { PackageManager, Theme } from "../../constants/prefs.ts";
import { pkgManagerPref, themePref } from "../../constants/prefs.ts";
import dracula from "../../styles/themes/dracula.css?type=raw";
import githubLight from "../../styles/themes/github-light.css?type=raw";
import base from "../../styles/utility/baseline.css?type=raw";
import { frontmatterIsSet } from "../../utils/index.ts";
import { toggleButton } from "../button/toggle.ts";
import "../focus-group/focus-group.ts";
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
  theme: Theme = themePref.fallback;

  eventAc: AbortController | undefined;

  connectedCallback() {
    super.connectedCallback();
    this.eventAc = new AbortController();
    document.addEventListener("themechange", (e) => (this.theme = e.newTheme), {
      signal: this.eventAc.signal,
    });
  }

  @state()
  pkgManager: PackageManager = pkgManagerPref.fallback;

  #setPackageManager(newValue: PackageManager) {
    this.pkgManager = pkgManagerPref.data = pkgManagerPref.storage = newValue;
  }

  firstUpdated() {
    this.theme = themePref.data;
    this.pkgManager = pkgManagerPref.data;
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
      toast.error("Failed to copy to clipboard");
      console.error("Failed to copy to clipboard", e);
    }
  }

  render() {
    const { devDep, pkg, repo, docs, includeInstall, pkgManager } = this;
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
                class="button-group install-buttons"
                @change=${(ev: Event) => {
                  this.#setPackageManager(
                    (ev.target as HTMLInputElement).value as PackageManager,
                  );
                }}
              >
                <legend class="sr-only">Install with</legend>
                ${repeat(
                  pkgManagerPref.options,
                  (key) => key,
                  (key) =>
                    toggleButton(key, {
                      ariaLabel: `Install with ${key}`,
                      // input
                      name: "package-manager",
                      value: key,
                      checked: pkgManager === key,
                    }),
                )}
              </fieldset>
              <div class="command">
                <pre
                  class="language-bash"
                  id="install-command"
                ><code class="language-bash"><span class="token function">${pkgManager}</span> <span class="token function">${pkgManagerPref
                  .meta[pkgManager].install}</span> ${when(
                  frontmatterIsSet(devDep),
                  () => html`<span class="token parameter variable">-D</span> `,
                )}${pkgManagerPref.meta[pkgManager].prefix ??
                ""}${pkg}</code></pre>
                <button
                  class="icon"
                  aria-label="Copy to clipboard"
                  @click=${() => this.#onCopy()}
                  ${ref((el) => {
                    if (el) Tooltip.lazy(el);
                  })}}
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
