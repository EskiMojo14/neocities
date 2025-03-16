import { html, LitElement, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { repeat } from "lit/directives/repeat.js";
import { until } from "lit/directives/until.js";
import type { Package } from "../../data/index.ts";
import { getPackages } from "../../data/index.ts";
import base from "../../styles/base.css?type=raw";
import typography from "../../styles/typography.css?type=raw";
import "../pkg-card/pkg-card.ts";
import "../spinner/spinner.ts";
import pkgList from "./pkg-list.css?type=raw";

@customElement("pkg-list")
export default class PkgList extends LitElement {
  static styles = [unsafeCSS(base), unsafeCSS(typography), unsafeCSS(pkgList)];

  #_packages: Array<Package> | undefined;
  async #getPackages() {
    return (this.#_packages ??= await getPackages());
  }

  render() {
    return html`
      <div class="pkg-list">
        ${until(
          this.#getPackages().then((packages) =>
            repeat(
              packages,
              (pkg) => pkg.pkg,
              (pkg) =>
                html`<pkg-card
                  pkg=${pkg.pkg}
                  repo=${pkg.repo}
                  docs=${ifDefined(pkg.docs)}
                  name=${pkg.title}
                  description=${pkg.description}
                  route=${pkg.route}
                  icon=${ifDefined(pkg.icon)}
                ></pkg-card>`,
            ),
          ),
          html`<hourglass-spinner></hourglass-spinner>`,
        )}
      </div>
    `;
  }
}
