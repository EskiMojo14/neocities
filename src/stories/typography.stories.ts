import type { Meta } from "@storybook/web-components";
import { html } from "lit-html";
import { repeat } from "lit-html/directives/repeat.js";
import { variants } from "../styles/typography.ts";
import styles from "./typography.module.css";

const meta = {
  title: "Theme/Typography",
  render: () => html`
    <div class="${styles.container}">
      <div class="${styles.scale}">
        ${repeat(
          variants,
          (item) => item,
          (item) => html` <p class="${styles.scaleItem} ${item}">${item}</p> `
        )}
        </div>
      </div>
    </div>`,
} satisfies Meta;

export default meta;

export const Typography = {};
