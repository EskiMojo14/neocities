import { html, LitElement, unsafeCSS } from "lit";
import { customElement, state } from "lit/decorators.js";
import { parse } from "valibot";
import type { Theme } from "../../../constants/prefs.ts";
import { themeSchema } from "../../../constants/prefs.ts";
import base from "../../../styles/base.css?type=raw";
import { assert } from "../../../utils/index.ts";
import themeToggle from "./theme-toggle.css?type=raw";

@customElement("theme-toggle")
export default class ThemeToggle extends LitElement {
  static styles = [unsafeCSS(base), unsafeCSS(themeToggle)];

  @state()
  currentTheme: Theme = "system";
  connectedCallback() {
    super.connectedCallback();
    this.currentTheme = parse(
      themeSchema,
      document.documentElement.dataset.theme ?? "system",
    );
  }

  get nextTheme() {
    const currentIdx = themeSchema.options.indexOf(this.currentTheme);
    const nextIdx = (currentIdx + 1) % themeSchema.options.length;
    const theme = themeSchema.options[nextIdx];
    assert(theme);
    return theme;
  }

  toggleTheme() {
    const theme = this.nextTheme;
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
    this.currentTheme = theme;
  }
  render() {
    return html`
      <button
        aria-label="Use ${this.nextTheme} theme"
        data-selected=${this.currentTheme}
        @click=${() => {
          this.toggleTheme();
        }}
      >
        <material-symbol aria-hidden="true" class="system"
          >routine</material-symbol
        >
        <material-symbol aria-hidden="true" class="light"
          >light_mode</material-symbol
        ><material-symbol aria-hidden="true" class="dark"
          >dark_mode</material-symbol
        >
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "theme-toggle": ThemeToggle;
  }
}
