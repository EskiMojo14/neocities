import type { Meta } from "@storybook/web-components";
import { html } from "lit";
import { repeat } from "lit/directives/repeat.js";
import styles from "./typography.module.css";

const variants = [
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

const meta = {
  title: "Theme/Typography",
  render: () => html`
    <div class="${styles.container}">
      <div class="${styles.scale}">
        ${repeat(
          variants,
          (item) => item,
          (item) => html` <p class="${styles.scaleItem} ${item}">${item}</p> `,
        )}
        </div>
      </div>
    </div>`,
} satisfies Meta;

export default meta;

export const Typography = {};
