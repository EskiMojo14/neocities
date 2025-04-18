import { html, LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { repeat } from "lit/directives/repeat.js";
import { getPackages } from "../../data/index.ts";
import base from "../../styles/utility/baseline.css?type=raw";
import { frontmatterIsSet } from "../../utils/index.ts";
import "../pkg-card/pkg-card.ts";
import "../spinner/spinner.ts";
import pkgList from "./pkg-list.css?type=raw";

const packages = await getPackages();

@customElement("pkg-list")
export default class PkgList extends LitElement {
  static styles = [unsafeCSS(base), unsafeCSS(pkgList)];

  @property({ type: String })
  tag = "${unset}";

  render() {
    const pkgs = frontmatterIsSet(this.tag)
      ? packages.filter((pkg) => pkg.tags.includes(this.tag))
      : packages;
    return html`
      <div class="pkg-list">
        ${repeat(
          pkgs,
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
              .tags=${pkg.tags}
            ></pkg-card>`,
        )}
      </div>
    `;
  }
}
