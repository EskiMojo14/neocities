import { html, LitElement, unsafeCSS } from "lit";
import { state } from "lit/decorators.js";
import base from "../../styles/utility/baseline.css?type=raw";
import styles from "./tab-group.css?type=raw";

type Tab = { id: string; label: string; render: () => unknown };

export abstract class TabGroup extends LitElement {
  static styles = [unsafeCSS(base), unsafeCSS(styles)];
  protected abstract label: string;
  protected abstract tabs: Array<Tab>;

  @state()
  private selected = 0;

  #handleKeyDown(event: KeyboardEvent, index: number) {
    const rtl = this.matches(":dir(rtl)");
    let next: number;
    switch (event.key) {
      case "ArrowRight":
        next = (index + (rtl ? -1 : 1) + this.tabs.length) % this.tabs.length;
        break;
      case "ArrowLeft":
        next = (index + (rtl ? 1 : -1) + this.tabs.length) % this.tabs.length;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = this.tabs.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    this.selected = next;
    this.renderRoot.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  }

  render() {
    // Keep inactive panels mounted to preserve state and query subscriptions.
    return html`
      <div class="button-group button-group--square" role="tablist" aria-label=${this.label}>
        ${this.tabs.map(
          (tab, index) => html`
            <button
              type="button"
              role="tab"
              id=${`tab-${tab.id}`}
              aria-controls=${`panel-${tab.id}`}
              aria-selected=${String(this.selected === index)}
              tabindex=${this.selected === index ? 0 : -1}
              @click=${() => {
                this.selected = index;
              }}
              @keydown=${(event: KeyboardEvent) => this.#handleKeyDown(event, index)}
            >
              ${tab.label}
            </button>
          `,
        )}
      </div>
      ${this.tabs.map(
        (tab, index) => html`
          <div
            role="tabpanel"
            id=${`panel-${tab.id}`}
            aria-labelledby=${`tab-${tab.id}`}
            tabindex="0"
            ?hidden=${this.selected !== index}
          >
            ${tab.render()}
          </div>
        `,
      )}
    `;
  }
}
