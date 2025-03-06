import type { Properties } from "csstype";
import type { DirectiveResult } from "lit-html/directive.js";
import type { AsyncReplaceDirective } from "lit-html/directives/async-replace.js";
import { asyncReplace as _asyncReplace } from "lit-html/directives/async-replace.js";
import type { ClassInfo } from "lit-html/directives/class-map.js";
import { classMap } from "lit-html/directives/class-map.js";
import type { StyleInfo } from "lit-html/directives/style-map.js";
import { styleMap as _styleMap } from "lit-html/directives/style-map.js";
import { safeAssign, typewriter } from "./index.ts";

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

export function ensureDir(dir: string): "ltr" | "rtl" | "auto" {
  return dir === "rtl" || dir === "ltr" ? dir : "auto";
}

export function isActiveLink(
  href: string | undefined,
  currentRoute: string,
  comparison: "includes" | "equals" = "includes"
): boolean {
  if (!href) return false;
  if (href === "/" || comparison === "equals") {
    return currentRoute === href;
  }
  return currentRoute.includes(href);
}

export const asyncReplace = _asyncReplace as <T>(
  iterable: AsyncIterable<T>,
  mapper?: (value: T, index: number) => unknown
) => DirectiveResult<typeof AsyncReplaceDirective>;

export const consolewriter = (
  ...[text, config]: Parameters<typeof typewriter>
) =>
  asyncReplace(
    typewriter(text, { finishedSuffix: "▯", typingSuffix: "▮", ...config })
  );
