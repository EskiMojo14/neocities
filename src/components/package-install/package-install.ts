import { LitElement, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { html } from "lit-html";
import base from "../../styles/base.css?type=raw";

const installCommands = {
  npm: "install",
  yarn: "add",
  pnpm: "add",
  bun: "add",
} satisfies Record<string, string>;

type PackageManager = keyof typeof installCommands;

@customElement("package-install")
export default class PackageInstall extends LitElement {
  static styles = [unsafeCSS(base)];

  @property({ type: String, attribute: "dev-dep" })
  devDep = "";

  @state()
  packageManager: PackageManager = "pnpm";

  render() {
    const { devDep } = this;
    return html`
      <code
        >${this.packageManager} ${installCommands[this.packageManager]}
        ${devDep === "true" ? "-D" : ""} <slot></slot
      ></code>
    `;
  }
}
