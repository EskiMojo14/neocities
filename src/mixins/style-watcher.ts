import { dedupeMixin } from "@open-wc/dedupe-mixin";
import type { PropertyValues } from "lit";
import { state } from "lit/decorators.js";
import type { Style } from "../constants/prefs.ts";
import { stylePref } from "../constants/prefs.ts";
import { Signalled } from "./signalled.ts";
import type { LitConstructor } from "./types.ts";

export const StyleWatcher = dedupeMixin(
  <T extends LitConstructor>(baseClass: T) => {
    class StyleWatcherClass extends Signalled(baseClass) {
      @state()
      pageStyle: Style = stylePref.fallback;

      connectedCallback() {
        super.connectedCallback();
        document.addEventListener(
          "stylechange",
          (e) => (this.pageStyle = e.newStyle),
          { signal: this.signal },
        );
      }

      firstUpdated(_changedProperties: PropertyValues<this>) {
        super.firstUpdated(_changedProperties);
        this.pageStyle = stylePref.data;
      }
    }
    return StyleWatcherClass;
  },
);
