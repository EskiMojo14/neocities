import { dedupeMixin } from "@open-wc/dedupe-mixin";
import type { LitConstructor } from "./types.ts";

export const Signalled = dedupeMixin(
  <T extends LitConstructor>(superClass: T) => {
    class SignalledClass extends superClass {
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
    return SignalledClass;
  },
);
