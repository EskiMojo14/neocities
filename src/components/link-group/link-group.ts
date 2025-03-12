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

  #getActiveElement(): Element | null {
    let el = document.activeElement;
    while (el?.shadowRoot) {
      el = el.shadowRoot.activeElement;
    }
    return el;
  }

  #handleKeyDown(event: KeyboardEvent) {
    const focused = this.#getActiveElement();
    if (!this.contains(focused)) return;
    const keys = this.#getNextKeys();
    switch (event.key) {
      case keys.prev: {
        const prev = focused?.previousElementSibling;
        if (prev instanceof HTMLElement) prev.focus();
        break;
      }
      case keys.next: {
        const next = focused?.nextElementSibling;
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
