import type { CSSResult } from "lit";
import { css, unsafeCSS } from "lit";

export const variants = [
  "headline1",
  "headline2",
  "headline3",
  "headline4",
  "headline5",
  "headline6",
  "body1",
  "body2",
  "subtitle1",
  "subtitle2",
  "button",
  "overline",
  "caption",
] as const;

const typographyScale = Object.fromEntries(
  variants.map((item) => {
    const variant = unsafeCSS(item);
    return [
      item,
      css`
        .${variant} {
          font-size: var(--${variant}-size);
          font-weight: var(--${variant}-weight);
          text-transform: var(--${variant}-transform);
        }
      `,
    ];
  })
) as Record<(typeof variants)[number], CSSResult>;

const all = Object.values(typographyScale);

export const typography = {
  ...typographyScale,
  all,
};
