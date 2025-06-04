import { html, LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { SoftwareSourceCode } from "schema-dts";
import base from "../../styles/utility/baseline.css?type=raw";
import { excludeUnsetFrontmatter } from "../../utils/index.ts";
import "./json-ld.ts";

@customElement("pkg-ld")
export default class PkgLd extends LitElement {
  static styles = [unsafeCSS(base)];

  @property({ type: String })
  pkg = "${unset}";

  @property({ type: String })
  repo = "${unset}";

  @property({ type: String })
  docs = "${unset}";

  @property({ type: String })
  name = "${unset}";

  @property({ type: String })
  description = "${unset}";

  @property({ type: String })
  route = "${unset}";

  render() {
    return html`<json-ld
      .data=${{
        "@type": "SoftwareSourceCode",
        "@id": excludeUnsetFrontmatter(this.route),
        author: "eskimojo",
        name: excludeUnsetFrontmatter(this.name),
        description: excludeUnsetFrontmatter(this.description),
        url: excludeUnsetFrontmatter(this.route),
        codeRepository: `https://github.com/${excludeUnsetFrontmatter(this.repo)}`,
        programmingLanguage: "TypeScript",
        runtimePlatform: "Node.js",
      } satisfies SoftwareSourceCode}
    ></json-ld>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "pkg-ld": PkgLd;
  }
}
