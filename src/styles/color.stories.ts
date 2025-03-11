import type { Meta } from "@storybook/web-components";
import { html } from "lit-html";
import { repeat } from "lit-html/directives/repeat.js";
import styles from "./color.module.css";

const darkColors = [
  "black",
  "black-secondary",
  "black-ternary",
  "grey",
  "grey-secondary",
  "white",
  "white-secondary",
  "cyan",
  "cyan-secondary",
  "green",
  "green-secondary",
  "orange",
  "orange-secondary",
  "pink",
  "pink-secondary",
  "purple",
  "purple-secondary",
  "red",
  "red-secondary",
  "yellow",
  "yellow-secondary",
  "disabled",
  "background",
  "comment",
  "selection",
];

const lightPalettes = {
  blue: 9,
  green: 9,
  yellow: 9,
  orange: 9,
  red: 9,
  purple: 9,
  pink: 9,
  coral: 9,
  neutral: 13,
};

const lightColors = [
  "white",
  "white-secondary",
  "grey",
  "black",
  "blue",
  "blue-secondary",
  "red",
  "purple",
  "light-blue",
  "foreground",
  "selection",
];

const meta = {
  title: "Theme/Colors",
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    theme: {
      table: {
        disable: true,
      },
    },
  },
  render: () => html`
    <div class="${styles.container}">
      <div class="${styles.group}" data-theme="dark">
        <h3>Dark colors</h3>
        <div class="${styles.grid}">
          ${repeat(
            darkColors,
            (color) => color,
            (color) => html`
              <div
                class="body2 ${styles.color}"
                style="background: var(--${color})"
              >
                <span>${color}</span>
              </div>
            `,
          )}
        </div>
      </div>
      <div class="${styles.group}" data-theme="light">
        <h3>Light colors</h3>
        <div class="${styles.grid}">
          ${repeat(
            lightColors,
            (color) => color,
            (color) => html`
              <div
                class="body2 ${styles.color}"
                style="background: var(--${color})"
              >
                <span>${color}</span>
              </div>
            `,
          )}
        </div>
        <h4>Palettes</h4>
        <div class="${styles.grid}">
          ${repeat(
            Object.entries(lightPalettes),
            ([name]) => name,
            ([name, last]) => html`
              <div class="${styles.palette}">
                ${repeat(
                  Array.from({ length: last + 1 }, (_, i) => i),
                  (i) => i,
                  (i) => html`
                    <div
                      class="body2 ${styles.color}"
                      style="background: var(--${name}${i})"
                    >
                      <span>${name}${i}</span>
                    </div>
                  `,
                )}
              </div>
            `,
          )}
        </div>
      </div>
    </div>
  `,
} satisfies Meta;

export default meta;

export const Colors = {};
