import { html, LitElement, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";
import base from "../../styles/utility/baseline.css?type=raw";
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
