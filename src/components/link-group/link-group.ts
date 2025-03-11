import { LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { html } from "lit-html";

@customElement("link-group")
export default class LinkGroup extends LitElement {
  constructor() {
    super();
    this.addEventListener("keydown", this.#handleKeyDown.bind(this));
  }

  #getNextKeys() {
    const isRtl = this.matches(":dir(rtl)");
    return {
      next: isRtl ? "ArrowLeft" : "ArrowRight",
      prev: isRtl ? "ArrowRight" : "ArrowLeft",
    };
  }

  #handleKeyDown(event: KeyboardEvent) {
    if (!this.contains(document.activeElement)) return;
    const keys = this.#getNextKeys();
    switch (event.key) {
      case keys.prev: {
        const prev = document.activeElement?.previousElementSibling;
        if (prev instanceof HTMLElement) prev.focus();
        break;
      }
      case keys.next: {
        const next = document.activeElement?.nextElementSibling;
        if (next instanceof HTMLElement) next.focus();
        break;
      }
    }
  }

  render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "link-group": LinkGroup;
  }
}
