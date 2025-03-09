import { LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { html } from "lit-html";
import base from "../../styles/base.css?type=raw";

@customElement("package-install")
export default class PackageInstall extends LitElement {
  static styles = [unsafeCSS(base)];

  @property({ type: String, attribute: "dev-dep" })
  devDep = "";

  render() {
    const { devDep } = this;
    return html`
      <code>pnpm add ${devDep === "true" ? "-D" : ""} <slot></slot></code>
    `;
  }
}
