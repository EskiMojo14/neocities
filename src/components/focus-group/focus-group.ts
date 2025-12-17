import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { getActiveElement } from "../../utils/index.ts";

@customElement("focus-group")
export default class FocusGroup extends LitElement {
  constructor() {
    super();
    this.addEventListener("keydown", this.#handleKeyDown.bind(this));
  }

  @property()
  direction: "horizontal" | "vertical" = "horizontal";

  #getNextKeys() {
    if (this.direction === "vertical") {
      return {
        next: "ArrowDown",
        prev: "ArrowUp",
      };
    }
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
        if (prev instanceof HTMLElement) {
          prev.focus();
          event.preventDefault();
        }
        break;
      }
      case keys.next: {
        const next = focused.nextElementSibling;
        if (next instanceof HTMLElement) {
          next.focus();
          event.preventDefault();
        }
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
