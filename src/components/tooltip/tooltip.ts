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
import { withSignal } from "../../mixins/mount-signal.ts";
import base from "../../styles/utility/baseline.css?type=raw";
import { getOrInsertComputed, safeAssign } from "../../utils/index.ts";
import "../console-writer/console-writer.ts";
import tooltip from "./tooltip.css?type=raw";

@customElement("tool-tip")
export default class Tooltip extends withSignal(LitElement) {
  static styles = [unsafeCSS(base), unsafeCSS(tooltip)];

  @property({ type: Number })
  offset = 4;

  @property({ type: String })
  text = "";

  #targetAc: AbortController | undefined;
  #target: Element | null = null;

  get target() {
    return this.#target;
  }

  set target(value: Element | null) {
    if (this.#targetAc) this.#targetAc.abort();
    const ac = (this.#targetAc = new AbortController());
    if (value) {
      radEventListeners(
        value as HTMLElement,
        {
          pointerenter: this.requestShow,
          focus: this.show,
          pointerleave: this.requestHide,
          blur: this.hide,
        },
        {
          signal: ac.signal,
        },
      );
    }
    this.#target = value;
  }

  @property({ type: Number })
  delay = 1000;

  static cache = new WeakMap<Element, Tooltip>();
  static current: Tooltip | null = null;
  static tooltipOpened(tooltip: Tooltip) {
    this.current?.hide();
    this.current = tooltip;
  }
  static tooltipClosed(tooltip: Tooltip) {
    if (this.current === tooltip) this.current = null;
  }

  #showTimeoutId: ReturnType<typeof setTimeout> | undefined;

  requestShow = () => {
    if (Tooltip.current) {
      this.show();
      return;
    }
    clearTimeout(this.#showTimeoutId);
    this.#showTimeoutId = setTimeout(this.show, this.delay);
  };

  show = () => {
    clearTimeout(this.#hideTimeoutId);
    if (this.dataset.visible || !this.target) return;
    this.target.setAttribute("aria-describedby", this.id);

    Tooltip.tooltipOpened(this);
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

  #hideTimeoutId: ReturnType<typeof setTimeout> | undefined;
  requestHide = () => {
    if (Tooltip.current !== this) {
      this.hide();
      return;
    }
    clearTimeout(this.#hideTimeoutId);
    this.#hideTimeoutId = setTimeout(this.hide, this.delay);
  };

  hide = () => {
    clearTimeout(this.#showTimeoutId);
    delete this.dataset.visible;
  };

  finishHide = () => {
    if (this.dataset.visible) return;
    Tooltip.tooltipClosed(this);
    this.target?.removeAttribute("aria-describedby");
    this.remove();
  };

  constructor() {
    super();
    this.addEventListener("transitionend", this.finishHide);
  }

  connectedCallback(): void {
    super.connectedCallback();

    this.target ??= this.previousElementSibling;
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    this.id ||= `${this.target?.id || nanoid(10)}-tooltip`;
    this.text ||= this.target?.ariaLabel ?? "";

    this.role = "tooltip";

    radEventListeners(
      document,
      {
        scroll: this.hide,
        keydown: (event) => {
          if (event.key === "Escape") this.hide();
        },
      },
      { signal: this.signal },
    );
  }

  render() {
    return html`
      <div class="caption">
        <!-- to help layout -->
        <span aria-hidden="true">${this.text}</span>
        <console-writer
          class="caption"
          interval="50"
          text=${this.text}
        ></console-writer>
      </div>
    `;
  }

  static lazy(target: Element, opts: Partial<Tooltip> = {}) {
    const ac = new AbortController();
    function createTooltip(delayed = true) {
      return function () {
        if (Tooltip.current?.target === target) return;
        const tooltip = getOrInsertComputed(Tooltip.cache, target, () =>
          document.createElement("tool-tip"),
        );
        safeAssign(tooltip, { target }, opts);
        if (delayed) {
          tooltip.requestShow();
        } else {
          tooltip.show();
        }
        ac.abort();
      };
    }
    radEventListeners(
      target as HTMLElement,
      {
        pointerenter: createTooltip(),
        focus: createTooltip(false),
      },
      {
        signal: ac.signal,
      },
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "tool-tip": Tooltip;
  }
}
