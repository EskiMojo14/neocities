import { html, LitElement, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";
import base from "../../styles/utility/baseline.css?type=raw";
import textSkeleton from "./text-skeleton.css?type=raw";

@customElement("text-skeleton")
export default class TextSkeleton extends LitElement {
  static styles = [unsafeCSS(base), unsafeCSS(textSkeleton)];

  render() {
    return html`<div class="content"><slot></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "text-skeleton": TextSkeleton;
  }
}
