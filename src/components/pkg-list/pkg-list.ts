import { getContentByRoute } from "@greenwood/cli/src/data/client.js";
import { LitElement, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";
import { html } from "lit-html";
import { ifDefined } from "lit-html/directives/if-defined.js";
import { repeat } from "lit-html/directives/repeat.js";
import * as v from "valibot";
import base from "../../styles/base.css?type=raw";
import typography from "../../styles/typography.css?type=raw";
import "../pkg-card/pkg-card.ts";
import pkgList from "./pkg-list.css?type=raw";

const pkgSchema = v.object({
  pkg: v.string(),
  repo: v.string(),
  docs: v.optional(v.string()),
  name: v.string(),
  description: v.string(),
  route: v.string(),
  icon: v.optional(v.string()),
});

async function getPackages() {
  const content = await getContentByRoute("/packages/");
  return content
    .filter((page) => page.route !== "/packages/")
    .map((page) =>
      v.parse(pkgSchema, {
        pkg: page.data.package,
        repo: page.data.repo,
        docs: page.data.docs,
        description: page.data.description,
        name: page.title,
        route: page.route,
        icon: page.data.icon,
      } satisfies Record<keyof v.InferInput<typeof pkgSchema>, unknown>),
    )
    .sort((a, b) => a.name.localeCompare(b.name));
}

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
              name=${pkg.name}
              description=${pkg.description}
              route=${pkg.route}
              icon=${ifDefined(pkg.icon)}
            ></pkg-card>`,
        )}
      </div>
    `;
  }
}
