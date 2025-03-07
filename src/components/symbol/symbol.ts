import { LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("material-symbol")
export default class MaterialSymbol extends LitElement {
  createRenderRoot() {
    return this;
  }

  @property({ type: Boolean, attribute: "flip-rtl" })
  flipRtl = false;
}

declare global {
  interface HTMLElementTagNameMap {
    "material-symbol": MaterialSymbol;
  }
}
