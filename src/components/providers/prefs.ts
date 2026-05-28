import { themePref, stylePref, pkgManagerPref } from "../../constants/prefs.ts";
import { customElement, state } from "lit/decorators.js";
import { provide } from "@lit/context";
import { html, LitElement } from "lit";
import { Signalled } from "../../mixins/signalled.ts";
import { radEventListeners } from "rad-event-listeners";

@customElement("prefs-provider")
export class PrefsProvider extends Signalled(LitElement) {
  @provide({ context: themePref.context })
  @state()
  theme = themePref.data;

  @provide({ context: stylePref.context })
  @state()
  pageStyle = stylePref.data;

  @provide({ context: pkgManagerPref.context })
  @state()
  packageManager = pkgManagerPref.data;

  connectedCallback() {
    super.connectedCallback();
    this.theme = themePref.data;
    this.pageStyle = stylePref.data;
    this.packageManager = pkgManagerPref.data;
    radEventListeners(
      document,
      {
        themechange: (e) => {
          this.theme = themePref.data = themePref.storage = e.newTheme;
        },
        stylechange: (e) => {
          this.pageStyle = stylePref.data = stylePref.storage = e.newStyle;
        },
        pkgmanagerchange: (e) => {
          this.packageManager = pkgManagerPref.data = pkgManagerPref.storage = e.newPkgManager;
        },
      },
      { signal: this.signal },
    );
  }

  render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "prefs-provider": PrefsProvider;
  }
}
