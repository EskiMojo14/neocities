import { html, LitElement, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";
import { createRef, ref } from "lit/directives/ref.js";
import { Signalled } from "../../mixins/signalled.ts";
import base from "../../styles/utility/baseline.css?type=raw";
import { smoothScroll } from "../../utils/lit.ts";
import Tooltip from "../tooltip/tooltip.ts";

@customElement("scroll-to-top")
export default class ScrollToTop extends Signalled(LitElement) {
  static styles = [unsafeCSS(base)];

  buttonRef = createRef<HTMLButtonElement>();

  #setTabIndex(scrolled: boolean) {
    if (scrolled) {
      this.buttonRef.value?.removeAttribute("tabindex");
    } else {
      this.buttonRef.value?.setAttribute("tabindex", "-1");
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.#setTabIndex(!!document.documentElement.dataset.scrolled);
    document.addEventListener(
      "scrollstate",
      (e) => {
        this.#setTabIndex(e.scrolled);
      },
      { signal: this.signal },
    );
  }

  render() {
    return html`
      <button
        aria-label="Scroll to top"
        class="icon filled"
        @click=${() => {
          window.scrollTo({ top: 0, behavior: smoothScroll() });
        }}
        ${ref((el) => {
          Object.assign(this.buttonRef, { value: el });
          if (el) Tooltip.lazy(el);
        })}
      >
        <material-symbol aria-hidden="true">arrow_upward</material-symbol>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "scroll-to-top": ScrollToTop;
  }
}
