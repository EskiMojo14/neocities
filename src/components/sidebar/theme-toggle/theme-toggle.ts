import { LitElement, unsafeCSS } from "lit";
import { customElement, state } from "lit/decorators.js";
import { html } from "lit-html";
import base from "../../../styles/base.css?type=raw";
import themeToggle from "./theme-toggle.css?type=raw";

@customElement("theme-toggle")
export default class ThemeToggle extends LitElement {
  static styles = [unsafeCSS(base), unsafeCSS(themeToggle)];

  @state()
  currentTheme = "dark";
  connectedCallback() {
    super.connectedCallback();
    this.currentTheme = document.documentElement.dataset.theme ?? "dark";
  }

  toggleTheme() {
    const theme = this.currentTheme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
    this.currentTheme = theme;
  }
  render() {
    return html`
      <button
        aria-label="Use dark theme"
        aria-pressed=${this.currentTheme === "dark"}
        @click=${() => {
          this.toggleTheme();
        }}
      >
        <material-symbol
          aria-hidden="true"
          ?data-selected=${this.currentTheme === "light"}
          >light_mode</material-symbol
        ><material-symbol
          aria-hidden="true"
          ?data-selected=${this.currentTheme === "dark"}
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
