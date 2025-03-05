import type { Meta } from "@storybook/web-components";
import { html } from "lit-html";
import { repeat } from "lit-html/directives/repeat.js";
import styles from "./color.module.css";

const baseColors = [
  "black",
  "grey",
  "white",
  "cyan",
  "green",
  "orange",
  "pink",
  "purple",
  "red",
  "yellow",
  "disabled",
];

const extendedColors = [
  "black-secondary",
  "black-ternary",
  "grey-secondary",
  "grey-ternary",
  "white-secondary",
  "cyan-secondary",
  "green-secondary",
  "orange-secondary",
  "pink-secondary",
  "purple-secondary",
  "red-secondary",
  "yellow-secondary",
];

const meta = {
  title: "Theme/Colors",
  render: () => html`
    <div class="${styles.container}">
      <div class="${styles.group}">
        <h3>Base colors</h3>
        <div class="${styles.grid}">
          ${repeat(
            baseColors,
            (color) => color,
            (color) => html`
              <div
                class="body2 ${styles.color}"
                style="background: var(--${color})"
              >
                <span>${color}</span>
              </div>
            `
          )}
        </div>
      </div>
      <div class="${styles.group}">
        <h3>Extended colors</h3>
        <div class="${styles.grid}">
          ${repeat(
            extendedColors,
            (color) => color,
            (color) => html`
              <div
                class="body2 ${styles.color}"
                style="background: var(--${color})"
              >
                <span>${color}</span>
              </div>
            `
          )}
        </div>
      </div>
    </div>
  `,
} satisfies Meta;

export default meta;

export const Colors = {};
