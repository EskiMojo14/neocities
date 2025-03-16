import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { getActiveElement } from "../../utils/index.ts";

@customElement("focus-group")
export default class FocusGroup extends LitElement {
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
    const focused = getActiveElement(this);
    if (!focused) return;
    const keys = this.#getNextKeys();
    switch (event.key) {
      case keys.prev: {
        const prev = focused.previousElementSibling;
        if (prev instanceof HTMLElement) prev.focus();
        break;
      }
      case keys.next: {
        const next = focused.nextElementSibling;
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
    "focus-group": FocusGroup;
  }
}
