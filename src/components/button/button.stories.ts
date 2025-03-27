import { fn } from "@storybook/test";
import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { repeat } from "lit/directives/repeat.js";
import "../focus-group/focus-group.ts";

const meta = {
  title: "Button",
  tags: ["autodocs"],
  component: "button",
  args: {
    textContent: "button",
    onclick: fn(),
  },
} satisfies Meta<HTMLButtonElement>;

export default meta;

type Story = StoryObj<HTMLButtonElement>;

export const Default: Story = {};

export const Outlined: Story = {
  args: {
    className: "outlined",
  },
};

export const Icon: Story = {
  args: {
    className: "icon",
    innerHTML: "<material-symbol>home</material-symbol>",
  },
};

export const Group: Story = {
  render: ({ onclick, textContent }) => html`
    <focus-group class="button-group outlined">
      ${repeat(
        Array.from({ length: 3 }, (_, i) => i),
        (i) => i,
        (i) => html`<button @click=${onclick}>${textContent}${i}</button> `,
      )}
    </focus-group>
  `,
};
