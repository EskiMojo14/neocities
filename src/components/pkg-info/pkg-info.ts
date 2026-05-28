import { html, LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ref } from "lit/directives/ref.js";
import { repeat } from "lit/directives/repeat.js";
import { when } from "lit/directives/when.js";
import type { PackageManager, Style, Theme } from "../../constants/prefs.ts";
import { pkgManagerPref, stylePref, themePref } from "../../constants/prefs.ts";
import { renderQueryResult } from "../../utils/query.ts";
import { getMonthlyDownloads } from "../../data/npm.ts";
import dracula from "../../styles/themes/dracula.css?type=raw";
import githubLight from "../../styles/themes/github-light.css?type=raw";
import base from "../../styles/utility/baseline.css?type=raw";
import { decimalFormat, frontmatterIsSet } from "../../utils/index.ts";
import { toggleButton } from "../button/toggle.ts";
import "../focus-group/focus-group.ts";
import "../skeleton/text-skeleton.ts";
import { toast } from "../toaster/toaster.ts";
import Tooltip from "../tooltip/tooltip.ts";
import pkgInfo from "./pkg-info.css?type=raw";
import { createQueryController } from "@tanstack/lit-query";
import { consume } from "@lit/context";

class PkgManagerChangeEvent extends Event {
  newPkgManager: PackageManager;
  constructor(newPkgManager: PackageManager) {
    super("pkgmanagerchange", { bubbles: true, composed: true });
    this.newPkgManager = newPkgManager;
  }
}

@customElement("pkg-info")
export default class PkgInfo extends LitElement {
  static styles = [unsafeCSS(base), unsafeCSS(githubLight), unsafeCSS(dracula), unsafeCSS(pkgInfo)];

  #fetchDownloads = createQueryController(this, () => ({
    ...getMonthlyDownloads(this.pkg),
    enabled: typeof window !== "undefined",
  }));

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

  @consume({ context: themePref.context, subscribe: true })
  theme: Theme = themePref.fallback;

  @consume({ context: stylePref.context, subscribe: true })
  pageStyle: Style = stylePref.fallback;

  @consume({ context: pkgManagerPref.context, subscribe: true })
  pkgManager: PackageManager = pkgManagerPref.fallback;

  #setPkgManager(newPkgManager: PackageManager) {
    this.dispatchEvent(new PkgManagerChangeEvent(newPkgManager));
  }

  async #onCopy() {
    try {
      const text = this.shadowRoot?.getElementById("install-command")?.textContent;
      if (!text) return;
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard", true);
    } catch (e) {
      toast.error("Failed to copy to clipboard");
      console.error("Failed to copy to clipboard", e);
    }
  }

  render(): unknown {
    const { devDep, pkg, repo, docs, includeInstall, pkgManager } = this;
    return html`
      <div data-theme=${this.theme}>
        <focus-group>
          ${when(
            frontmatterIsSet(docs) && docs,
            () => html`
              <a href="${docs}" target="_blank" rel="noopener noreferrer">
                <material-symbol aria-hidden="true">developer_guide</material-symbol>
                Docs
              </a>
              |
            `,
          )}
          <span>
            <a href="https://www.npmx.dev/package/${pkg}" target="_blank" rel="noopener noreferrer">
              <material-symbol aria-hidden="true">deployed_code</material-symbol>
              npmx
            </a>
            ${when(
              !this.#fetchDownloads.current?.isError,
              () => html`
                <span class="download-count">
                  <material-symbol aria-hidden="true">download</material-symbol>
                  <span>
                    ${renderQueryResult(this.#fetchDownloads, {
                      pending: () => html` <text-skeleton>00</text-skeleton> `,
                      success: ({ data }) =>
                        html`<span aria-label=${decimalFormat(data.downloads, "normal")}>
                          ${decimalFormat(data.downloads, this.pageStyle)}</span
                        >`,
                    })}
                    <span aria-label="downloads in the last month">/mo</span>
                  </span>
                </span>
              `,
            )}</span
          >
          |
          <a href="https://github.com/${repo}" target="_blank" rel="noopener noreferrer">
            <material-symbol aria-hidden="true">code</material-symbol>
            GitHub
          </a>
        </focus-group>
        ${when(
          includeInstall,
          () => html`
            <div class="install">
              <fieldset
                class="button-group button-group--square install-buttons"
                @change=${(ev: Event) => {
                  this.#setPkgManager((ev.target as HTMLInputElement).value as PackageManager);
                }}
                needs-js
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
                  () => html` <span class="token parameter variable">-D</span> `,
                )}${pkgManagerPref.meta[pkgManager].prefix ?? ""}${pkg}</code></pre>
                <button
                  class="icon"
                  aria-label="Copy to clipboard"
                  @click=${() => this.#onCopy()}
                  ${ref((el) => {
                    if (el) Tooltip.lazy(el);
                  })}
                  needs-js
                >
                  <material-symbol aria-hidden="true">content_copy</material-symbol>
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
  interface GlobalEventHandlersEventMap {
    pkgmanagerchange: PkgManagerChangeEvent;
  }
  interface Document {
    onpkgmanagerchange: ((this: Document, ev: PkgManagerChangeEvent) => void) | null;
  }
}
