import { html, LitElement, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { repeat } from "lit/directives/repeat.js";
import { getPackages } from "../../data/index.ts";
import base from "../../styles/utility/baseline.css?type=raw";
import typography from "../../styles/utility/typography.css?type=raw";
import "../pkg-card/pkg-card.ts";
import "../spinner/spinner.ts";
import pkgList from "./pkg-list.css?type=raw";

const packages = await getPackages();

@customElement("pkg-list")
export default class PkgList extends LitElement {
  static styles = [unsafeCSS(base), unsafeCSS(typography), unsafeCSS(pkgList)];

  render() {
    return html`
      <div class="pkg-list">
        ${repeat(
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
        )}
      </div>
    `;
  }
}
