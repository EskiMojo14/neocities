import { dedupeMixin } from "@open-wc/dedupe-mixin";
import type { PropertyValues } from "lit";
import { state } from "lit/decorators.js";
import type { Theme } from "../constants/prefs.ts";
import { themePref } from "../constants/prefs.ts";
import { Signalled } from "./signalled.ts";
import type { LitConstructor } from "./types.ts";

export const ThemeWatcher = dedupeMixin(
  <T extends LitConstructor>(baseClass: T) => {
    class ThemeWatcherClass extends Signalled(baseClass) {
      @state()
      theme: Theme = themePref.fallback;

      connectedCallback() {
        super.connectedCallback();
        document.addEventListener(
          "themechange",
          (e) => (this.theme = e.newTheme),
          { signal: this.signal },
        );
      }

      firstUpdated(_changedProperties: PropertyValues<this>) {
        super.firstUpdated(_changedProperties);
        this.theme = themePref.data;
      }
    }
    return ThemeWatcherClass;
  },
);
