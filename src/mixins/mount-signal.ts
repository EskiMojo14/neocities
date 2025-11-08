import type { LitConstructor } from "./types.ts";

export const withSignal = <T extends LitConstructor>(BaseElement: T) => {
  class SignalMixin extends BaseElement {
    #connectAc = new AbortController();
    /**
     * An abort signal that is aborted when the element is disconnected.
     */
    get signal() {
      return this.#connectAc.signal;
    }
    connectedCallback() {
      super.connectedCallback();
      this.#connectAc = new AbortController();
    }
    disconnectedCallback() {
      super.disconnectedCallback();
      this.#connectAc.abort();
    }
  }
  return SignalMixin;
};
