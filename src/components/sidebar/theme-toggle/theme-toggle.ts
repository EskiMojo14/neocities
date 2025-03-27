import { html, LitElement, unsafeCSS } from "lit";
import { customElement, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import * as v from "valibot";
import type { Theme } from "../../../constants/prefs.ts";
import { themeSchema } from "../../../constants/prefs.ts";
import base from "../../../styles/utility/baseline.css?type=raw";
import { toggleButton } from "../../button/toggle/toggle.ts";
import Tooltip from "../../tooltip/tooltip.ts";
import themeToggle from "./theme-toggle.css?type=raw";

const themeIcons: Record<Theme, string> = {
  system: "routine",
  light: "light_mode",
  dark: "dark_mode",
};

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
  _currentTheme: Theme = themeSchema.fallback;
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
    this.currentTheme = v.parse(
      themeSchema,
      document.documentElement.dataset.theme,
    );
  }

  setTheme(theme: Theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
    this.currentTheme = theme;
    this.dispatchEvent(new ThemeChangeEvent(theme));
  }

  firstUpdated() {
    for (const theme of themeSchema.options) {
      Tooltip.for(
        this.shadowRoot,
        `theme-${theme}-label`,
        `Use ${theme} theme`,
      );
    }
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
          themeSchema.options,
          (theme) => theme,
          (theme) =>
            toggleButton(
              html`<material-symbol aria-hidden="true"
                >${themeIcons[theme]}</material-symbol
              >`,
              {
                className: "icon",
                name: "theme",
                value: theme,
                checked: theme === this.currentTheme,
                labelAttributes: {
                  ariaLabel: `Use ${theme} theme`,
                },
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
