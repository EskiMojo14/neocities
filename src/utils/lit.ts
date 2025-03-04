import type { Properties } from "csstype";
import { unsafeCSS } from "lit";
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

export function isActiveLink(href: string) {
  return window.location.href.includes(href);
}
