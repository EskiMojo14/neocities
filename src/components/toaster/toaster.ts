import { html, LitElement, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";
import { ref } from "lit/directives/ref.js";
import { repeat } from "lit/directives/repeat.js";
import { nanoid } from "nanoid/non-secure";
import base from "../../styles/utility/baseline.css?type=raw";
import { assert, objectFromEntries, objectKeys } from "../../utils/index.ts";
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
  timeout?: number | boolean;
  node?: Element;
}

interface ToastState {
  ids: Array<string>;
  entities: Record<string, Toast>;
}

@customElement("toast-queue")
export default class Toaster extends LitElement {
  static styles = [unsafeCSS(base), unsafeCSS(toaster)];

  #debouncedUpdateId: ReturnType<typeof setTimeout> | undefined;
  #debounceUpdate() {
    clearTimeout(this.#debouncedUpdateId);
    this.#debouncedUpdateId = setTimeout(() => {
      this.requestUpdate();
    }, 200);
  }

  #toastState: ToastState = {
    ids: [],
    entities: {},
  };

  push(type: ToastType, message: string, timeout?: number | boolean) {
    const id = nanoid();
    this.#toastState.ids.push(id);
    this.#toastState.entities[id] = {
      id,
      message,
      type,
      timeout,
    };
    // update immediately
    clearTimeout(this.#debouncedUpdateId);
    this.requestUpdate();
    return () => {
      this.markExiting(id);
    };
  }

  markExiting(id: string) {
    const toast = this.#toastState.entities[id];
    if (!toast) return;
    toast.node?.classList.add("exiting");
  }

  close(id: string) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete this.#toastState.entities[id];
    this.#toastState.ids.splice(this.#toastState.ids.indexOf(id), 1);

    this.#debounceUpdate();
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
      <div
        class="region"
        role="region"
        tabindex="-1"
        aria-label="${this.#toastState.ids.length} notifications"
        @animationend=${this.#handleAnimationEnd}
      >
        <ol>
          ${repeat(
            this.#toastState.ids,
            (id) => id,
            (id) => {
              const toast = this.#toastState.entities[id];
              if (!toast) return;
              return html`
                <li>
                  <div
                    id="toast-${toast.id}"
                    data-id="${toast.id}"
                    role="alertdialog"
                    aria-modal="false"
                    aria-labelledby="toast-${toast.id}-message"
                    tabindex="0"
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
                      <material-symbol aria-hidden="true"
                        >close</material-symbol
                      >
                    </button>
                  </div>
                </li>
              `;
            },
          )}
        </ol>
      </div>
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
  objectFromEntries(
    objectKeys(typeIcons).map(
      (type) => [type, _toast.bind(null, type)] as const,
    ),
  ),
);

declare global {
  interface HTMLElementTagNameMap {
    "toast-queue": Toaster;
  }
}
