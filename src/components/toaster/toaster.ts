import { Debouncer } from "@tanstack/pacer";
import { html, LitElement, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";
import { ref } from "lit/directives/ref.js";
import { repeat } from "lit/directives/repeat.js";
import { nanoid } from "nanoid/non-secure";
import base from "../../styles/utility/baseline.css?type=raw";
import { assert, unsafeFromEntries, unsafeKeys } from "../../utils/index.ts";
import { clsx, styleMap } from "../../utils/lit.ts";
import toaster from "./toaster.css?type=raw";

export const typeIcons = {
  info: "info",
  success: "check_circle",
  warning: "warning",
  error: "error",
} as const;
type ToastType = keyof typeof typeIcons;

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  timeout?: number | true;
  node?: Element;
}

@customElement("toast-queue")
export default class Toaster extends LitElement {
  static styles = [unsafeCSS(base), unsafeCSS(toaster)];

  #debouncedUpdate = new Debouncer(this.requestUpdate.bind(this), {
    wait: 200,
  });

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#debouncedUpdate.cancel();
  }

  #toastState = new Map<string, Toast>();

  push(type: ToastType, message: string, timeout?: number | true) {
    const id = nanoid();
    this.#toastState.set(id, {
      id,
      message,
      type,
      timeout,
    });
    // update immediately
    this.#debouncedUpdate.cancel();
    this.requestUpdate();
    return () => {
      this.markExiting(id);
    };
  }

  markExiting(id: string) {
    const toast = this.#toastState.get(id);
    if (!toast) return;
    toast.node?.classList.add("exiting");
  }

  close(id: string) {
    this.#toastState.delete(id);

    this.#debouncedUpdate.maybeExecute();
  }

  #handleAnimationEnd(e: AnimationEvent) {
    if (e.animationName !== "toast-exit") return;
    const { target } = e;
    assert(
      target instanceof HTMLElement,
      "Expected target to be an HTMLElement",
    );
    const id = target.dataset.id;
    assert(id, "Expected data-id to be present");
    this.close(id);
  }

  render() {
    return html`
      <section
        class="region"
        role="region"
        tabindex="-1"
        aria-label="${this.#toastState.size} notifications"
        @animationend=${this.#handleAnimationEnd}
      >
        ${repeat(
          this.#toastState.entries(),
          ([id]) => id,
          ([, toast]) => {
            return html`
              <output
                id="toast-${toast.id}"
                data-id="${toast.id}"
                role="status"
                aria-modal="false"
                aria-labelledby="toast-${toast.id}-message"
                ${ref((toastNode) => {
                  if (!toastNode) return;
                  toast.node = toastNode;
                })}
                class=${clsx("toast", toast.type, {
                  "has-timeout": !!toast.timeout,
                })}
                style=${styleMap({
                  "--timeout": `${typeof toast.timeout === "boolean" ? 1 : toast.timeout}ms`,
                })}
              >
                <material-symbol aria-hidden="true" class="icon"
                  >${typeIcons[toast.type]}</material-symbol
                >
                <div class="content" role="alert" aria-atomic="true">
                  <span class="subtitle2" id="toast-${toast.id}-message"
                    >${toast.message}</span
                  >
                </div>
                <button
                  aria-label="Close notification"
                  class="icon"
                  @click=${() => {
                    this.markExiting(toast.id);
                  }}
                >
                  <material-symbol aria-hidden="true">close</material-symbol>
                </button>
              </output>
            `;
          },
        )}
      </section>
    `;
  }
}

function _toast(...args: Parameters<Toaster["push"]>) {
  const toaster = document.querySelector("toast-queue");
  assert(toaster, "Expected toast-queue to be present");
  return toaster.push(...args);
}

export const toast = Object.assign(
  _toast,
  unsafeFromEntries(
    unsafeKeys(typeIcons).map(
      (type) => [type, _toast.bind(null, type)] as const,
    ),
  ),
);

declare global {
  interface HTMLElementTagNameMap {
    "toast-queue": Toaster;
  }
}
