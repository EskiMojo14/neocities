import type { Properties } from "csstype";
import { html } from "lit";
import { asyncReplace as _asyncReplace } from "lit/directives/async-replace.js";
import type { ClassInfo } from "lit/directives/class-map.js";
import { classMap } from "lit/directives/class-map.js";
import type { RefOrCallback } from "lit/directives/ref.js";
import { ref as _ref } from "lit/directives/ref.js";
import type { StyleInfo } from "lit/directives/style-map.js";
import { styleMap as _styleMap } from "lit/directives/style-map.js";
import { getTypeInterval, safeAssign, wait } from "./index.ts";

declare module "csstype" {
  // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
  interface Properties {
    [variable: `--${string}`]: StyleInfo[string];
  }
}

export function styleMap(props: Properties) {
  return _styleMap(props as never);
}

type ClassValue =
  | ClassArray
  | ClassDictionary
  | string
  | number
  | null
  | boolean
  | undefined;
type ClassDictionary = Record<string, any>;
type ClassArray = Array<ClassValue>;

export function clsx(...args: Array<ClassValue>) {
  const final: Record<string, ClassInfo[string]> = {};
  function flatten(values: Array<ClassValue>) {
    for (const value of values) {
      if (!value) continue;
      if (Array.isArray(value)) {
        flatten(value);
      } else if (typeof value === "object") {
        safeAssign(final, value);
      } else {
        final[value.toString()] = true;
      }
    }
  }
  flatten(args);
  return classMap(final);
}

export function isActiveLink(
  href: string | undefined,
  currentRoute: string,
  comparison: "includes" | "equals",
): boolean {
  if (!href) return false;
  if (href === "/" || comparison === "equals") {
    return currentRoute === href;
  }
  return currentRoute.includes(href);
}

export const asyncReplace = _asyncReplace as <T>(
  iterable: AsyncIterable<T>,
  mapper?: (value: T, index: number) => unknown,
) => ReturnType<typeof _asyncReplace>;

export const ref = _ref as <T>(
  ref?: RefOrCallback<T>,
) => ReturnType<typeof _ref>;

export function consolewriter(text: string, cfg?: consolewriter.Config) {
  return asyncReplace(
    (async function* () {
      const { delay, finishingDelay, ...config } = {
        ...consolewriter.defaults,
        ...cfg,
      };
      const interval = getTypeInterval(text, config);
      let acc = "";
      await wait(delay);
      for (const char of text) {
        acc += char;
        yield html`${acc}<span class="cursor">x</span>`;
        await wait(interval);
      }
      yield html`${acc}<span class="cursor finished">x</span>`;
      await wait(finishingDelay);
      yield html`${acc}`;
    })(),
  );
}

consolewriter.defaults = {
  ...getTypeInterval.defaults,
  delay: 0,
  finishingDelay: 300,
} satisfies Required<consolewriter.Config>;

consolewriter.getDuration = function getDuration(
  text: string,
  cfg?: consolewriter.Config,
) {
  const { delay, finishingDelay, ...config } = {
    ...consolewriter.defaults,
    ...cfg,
  };
  return delay + getTypeInterval.getDuration(text, config) + finishingDelay;
};

export namespace consolewriter {
  export interface Config extends getTypeInterval.Config {
    delay?: number;
    finishingDelay?: number;
  }
}
