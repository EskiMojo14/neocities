import {
  autoPlacement,
  computePosition,
  offset,
  shift,
} from "@floating-ui/dom";
import { html, LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { nanoid } from "nanoid/non-secure";
import { radEventListeners } from "rad-event-listeners";
import base from "../../styles/utility/baseline.css?type=raw";
import typography from "../../styles/utility/typography.css?type=raw";
import "../console-writer/console-writer.ts";
import tooltip from "./tooltip.css?type=raw";

const enterEvents = ["pointerenter", "focus"] satisfies Array<
  keyof HTMLElementEventMap
>;
const exitEvents = ["pointerleave", "blur"] satisfies Array<
  keyof HTMLElementEventMap
>;

@customElement("tool-tip")
export default class Tooltip extends LitElement {
  static styles = [unsafeCSS(base), unsafeCSS(typography), unsafeCSS(tooltip)];

  @property({ type: Number })
  offset = 4;

  @property({ type: String })
  text = "";

  #documentAc: AbortController | undefined;

  #targetAc: AbortController | undefined;
  #target: Element | null = null;

  get target() {
    return this.#target;
  }

  set target(value: Element | null) {
    if (this.#targetAc) this.#targetAc.abort();
    const ac = (this.#targetAc = new AbortController());
    if (value) {
      enterEvents.forEach((ev) => {
        value.addEventListener(ev, this.show, {
          signal: ac.signal,
        });
      });
      exitEvents.forEach((ev) => {
        value.addEventListener(ev, this.hide, {
          signal: ac.signal,
        });
      });
    }
    this.#target = value;
  }

  show = () => {
    if (!this.target) return;
    this.target.after(this);
    this.dataset.visible = "true";
    void computePosition(this.target, this, {
      strategy: "fixed",
      middleware: [
        offset(this.offset),
        shift(),
        autoPlacement({ allowedPlacements: ["top", "bottom"] }),
      ],
    }).then(({ x, y }) => {
      this.style.left = `${x}px`;
      this.style.top = `${y}px`;
    });
  };

  hide = () => {
    delete this.dataset.visible;
  };

  finishHide = () => {
    if (this.dataset.visible) return;
    this.remove();
  };

  constructor() {
    super();
    this.addEventListener("transitionend", this.finishHide);
  }

  connectedCallback(): void {
    super.connectedCallback();

    this.hide();
    this.target ??= this.previousElementSibling;
    this.id ||= `${this.target?.id ?? nanoid(10)}-tooltip`;

    this.role = "tooltip";
    this.target?.setAttribute("aria-describedby", this.id);

    const ac = (this.#documentAc = new AbortController());
    radEventListeners(
      document,
      {
        scroll: this.hide,
        keydown: (event) => {
          if (event.key === "Escape") this.hide();
        },
      },
      {
        signal: ac.signal,
      },
    );
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#documentAc?.abort();
  }

  render() {
    return html`
      <div class="caption">
        <!-- to help layout -->
        <span aria-hidden="true">${this.text}</span>
        <console-writer class="caption" text=${this.text}></console-writer>
      </div>
    `;
  }

  static lazy(
    target: Element,
    text: string,
    callback?: (tooltip: Tooltip) => void,
  ) {
    function createTooltip() {
      const tooltip = document.createElement("tool-tip");
      tooltip.text = text;
      callback?.(tooltip);
      target.after(tooltip);
      tooltip.show();
      enterEvents.forEach((ev) => {
        target.removeEventListener(ev, createTooltip);
      });
    }
    enterEvents.forEach((ev) => {
      target.addEventListener(ev, createTooltip);
    });
  }

  static for(
    root: Document | ShadowRoot | DocumentFragment | null,
    id: string,
    text: string,
    callback?: (tooltip: Tooltip) => void,
  ) {
    const target = root?.getElementById(id);
    if (!target) return;
    Tooltip.lazy(target, text, callback);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "tool-tip": Tooltip;
  }
}
