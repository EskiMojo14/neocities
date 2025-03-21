import { html, LitElement, unsafeCSS } from "lit";
import { customElement, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import * as v from "valibot";
import type { Theme } from "../../../constants/prefs.ts";
import { themeSchema } from "../../../constants/prefs.ts";
import base from "../../../styles/utility/baseline.css?type=raw";
import { assert } from "../../../utils/index.ts";
import themeToggle from "./theme-toggle.css?type=raw";

const themeIcons: Record<Theme, string> = {
  system: "routine",
  light: "light_mode",
  dark: "dark_mode",
};

export class ThemeChangeEvent extends Event {
  constructor(public newTheme: Theme) {
    super("themechange", { bubbles: true, composed: true });
  }
}

@customElement("theme-toggle")
export default class ThemeToggle extends LitElement {
  static styles = [unsafeCSS(base), unsafeCSS(themeToggle)];

  @state()
  currentTheme: Theme = themeSchema.fallback;
  connectedCallback() {
    super.connectedCallback();
    this.currentTheme = v.parse(
      themeSchema,
      document.documentElement.dataset.theme,
    );
  }

  get nextTheme() {
    const currentIdx = themeSchema.options.indexOf(this.currentTheme);
    const nextIdx = (currentIdx + 1) % themeSchema.options.length;
    const theme = themeSchema.options[nextIdx];
    assert(theme);
    return theme;
  }

  setTheme(theme: Theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
    this.currentTheme = theme;
    this.dispatchEvent(new ThemeChangeEvent(theme));
  }

  render() {
    return html`
      <button
        aria-label="Use ${this.nextTheme} theme"
        data-selected=${this.currentTheme}
        @click=${() => {
          this.setTheme(this.nextTheme);
        }}
      >
        ${repeat(
          themeSchema.options,
          (theme) => theme,
          (theme) => html`
            <material-symbol aria-hidden="true" class="${theme}"
              >${themeIcons[theme]}</material-symbol
            >
          `,
        )}
      </button>
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
