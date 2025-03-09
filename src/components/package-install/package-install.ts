import { LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { html } from "lit-html";
import { when } from "lit-html/directives/when.js";
import dracula from "../../../node_modules/dracula-prism/dist/css/dracula-prism.css?type=raw";
import base from "../../styles/base.css?type=raw";

@customElement("package-install")
export default class PackageInstall extends LitElement {
  static styles = [unsafeCSS(dracula), unsafeCSS(base)];

  @property({ type: String, attribute: "dev-dep" })
  devDep = "";

  render() {
    const { devDep } = this;
    return html`
      <pre
        class="language-bash"
      ><code class="language-bash"><span class="token function">pnpm</span> <span class="token function">add</span> ${when(
        devDep === "true",
        () => html`<span class="token parameter variable">-D</span> `,
      )}<slot></slot></code></pre>
    `;
  }
}
