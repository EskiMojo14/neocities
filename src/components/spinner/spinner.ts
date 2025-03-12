import { LitElement, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";
import { html } from "lit-html";
import base from "../../styles/base.css?type=raw";
import "../symbol/symbol.ts";
import spinner from "./spinner.css?type=raw";

@customElement("hourglass-spinner")
export default class Spinner extends LitElement {
  static styles = [unsafeCSS(base), unsafeCSS(spinner)];

  render() {
    return html`<material-symbol aria-hidden="true"
        >hourglass_bottom</material-symbol
      >
      <material-symbol aria-hidden="true">hourglass_top</material-symbol>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hourglass-spinner": Spinner;
  }
}
