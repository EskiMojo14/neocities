import type { Properties } from "csstype";
import { unsafeCSS } from "lit";
import type { DirectiveResult } from "lit-html/directive.js";
import type { AsyncReplaceDirective } from "lit-html/directives/async-replace.js";
import { asyncReplace as _asyncReplace } from "lit-html/directives/async-replace.js";
import type { StyleInfo } from "lit-html/directives/style-map.js";
import { styleMap as _styleMap } from "lit-html/directives/style-map.js";

declare module "csstype" {
  // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
  interface Properties {
    [variable: `--${string}`]: StyleInfo[string];
  }
}

export function styleMap(props: Properties) {
  return _styleMap(props as never);
}

export const selectors = {
  rtl: unsafeCSS(":dir(rtl) &, &:dir(rtl)"),
};

export function ensureDir(dir: string): "ltr" | "rtl" | "auto" {
  return dir === "rtl" || dir === "ltr" ? dir : "auto";
}

export function isActiveLink(
  href?: string,
  comparison: "includes" | "equals" = "includes"
): boolean {
  if (!href) return false;
  if (href === "/" || comparison === "equals") {
    return window.location.pathname === href;
  }
  return window.location.pathname.includes(href);
}

export const asyncReplace = _asyncReplace as <T>(
  iterable: AsyncIterable<T>,
  mapper?: (value: T, index: number) => unknown
) => DirectiveResult<typeof AsyncReplaceDirective>;
