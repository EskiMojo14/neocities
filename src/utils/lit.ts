import {
  styleMap as _styleMap,
  StyleInfo,
} from "lit-html/directives/style-map.js";
import type { Properties } from "csstype";
import { css, CSSResultGroup } from "lit";

declare module "csstype" {
  interface Properties {
    [variable: `--${string}`]: StyleInfo[string];
  }
}

export function styleMap(props: Properties) {
  return _styleMap(props as never);
}

export function rtl(styles: CSSResultGroup): CSSResultGroup {
  return css`
    :dir(rtl) &,
    &:dir(rtl) {
      ${styles};
    }
  `;
}

export function ensureDir(dir: string): "ltr" | "rtl" | "auto" {
  return dir === "rtl" || dir === "ltr" ? dir : "auto";
}
