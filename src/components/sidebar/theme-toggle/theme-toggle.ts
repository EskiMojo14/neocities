import { html, LitElement, unsafeCSS } from "lit";
import { customElement, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import type { Theme } from "../../../constants/prefs.ts";
import { themePref } from "../../../constants/prefs.ts";
import base from "../../styles/utility/baseline.css?type=raw";
import { capitalize } from "../../../utils/index.ts";
import { toggleButton } from "../../button/toggle.ts";
import Tooltip from "../../tooltip/tooltip.ts";
import themeToggle from "./theme-toggle.css?type=raw";

export class ThemeChangeEvent extends Event {
  newTheme: Theme;
  constructor(newTheme: Theme) {
    super("themechange", { bubbles: true, composed: true });
    this.newTheme = newTheme;
  }
}

const themeColors = {
  dark: "#21222c", // var(--black);
  light: "#eff1f3", // var(--white-secondary);
};

@customElement("theme-toggle")
export default class ThemeToggle extends LitElement {
  static styles = [unsafeCSS(base), unsafeCSS(themeToggle)];

  @state()
  _currentTheme: Theme = themePref.fallback;
  get currentTheme() {
    return this._currentTheme;
  }
  set currentTheme(theme: Theme) {
    this._currentTheme = theme;

    document
      .getElementById("svg-favicon")
      ?.setAttribute("href", `/assets/icon-${theme}.svg`);
    const [meta1, ...rest] = document.querySelectorAll<HTMLMetaElement>(
      "meta[name=theme-color]",
    );
    rest.forEach((meta) => {
      meta.remove();
    });
    if (theme === "system") {
      meta1?.setAttribute("media", "(prefers-color-scheme: light)");
      meta1?.setAttribute("content", themeColors.light);
      const meta2 = document.createElement("meta");
      meta1?.after(meta2);
      meta2.setAttribute("name", "theme-color");
      meta2.setAttribute("media", "(prefers-color-scheme: dark)");
      meta2.setAttribute("content", themeColors.dark);
    } else {
      meta1?.removeAttribute("media");
      meta1?.setAttribute("content", themeColors[theme]);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.currentTheme = themePref.data;
  }

  setTheme(theme: Theme) {
    this.currentTheme = themePref.data = themePref.storage = theme;
    this.dispatchEvent(new ThemeChangeEvent(theme));
  }

  render() {
    return html`
      <fieldset
        class="button-group"
        @change=${(ev: Event) => {
          this.setTheme((ev.target as HTMLInputElement).value as Theme);
        }}
      >
        <legend class="sr-only">Theme</legend>
        ${repeat(
          themePref.options,
          (theme) => theme,
          (theme) =>
            toggleButton(
              html`<material-symbol aria-hidden="true"
                >${themePref.meta[theme].icon}</material-symbol
              >`,
              {
                className: "icon",
                ariaLabel: `${capitalize(theme)} theme`,
                ref(el) {
                  if (el) Tooltip.lazy(el);
                },
                // input
                name: "theme",
                value: theme,
                checked: theme === this.currentTheme,
              },
            ),
        )}
      </fieldset>
    `;
  }
}

declare global {
  interface GlobalEventHandlersEventMap {
    themechange: ThemeChangeEvent;
  }
  interface HTMLElementTagNameMap {
    "theme-toggle": ThemeToggle;
  }
}
