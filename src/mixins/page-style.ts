import type { PropertyValues } from "lit";
import type { Style } from "../constants/prefs.ts";
import { stylePref } from "../constants/prefs.ts";
import type { LitConstructor } from "./types.ts";

export const withStyle = <T extends LitConstructor>(baseElement: T) =>
  class extends baseElement {
    pageStyle: Style = stylePref.fallback;

    styleAc: AbortController | undefined;

    connectedCallback() {
      super.connectedCallback();
      document.addEventListener(
        "stylechange",
        (e) => (this.pageStyle = e.newStyle),
        {
          signal: (this.styleAc = new AbortController()).signal,
        },
      );
    }

    firstUpdated(_changedProperties: PropertyValues<this>) {
      super.firstUpdated(_changedProperties);
      this.pageStyle = stylePref.data;
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      this.styleAc?.abort();
    }
  };
