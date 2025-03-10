import { LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { html } from "lit-html";

@customElement("theme-toggle")
export default class ThemeToggle extends LitElement {
  createRenderRoot() {
    return this;
  }

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
        aria-label="Toggle theme"
        data-theme=${this.currentTheme}
        @click=${() => {
          this.toggleTheme();
        }}
      >
        <material-symbol aria-hidden="true" data-theme-option="light"
          >light_mode</material-symbol
        ><material-symbol aria-hidden="true" data-theme-option="dark"
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
