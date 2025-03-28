import { fn } from "@storybook/test";
import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { ref } from "lit/directives/ref.js";
import { repeat } from "lit/directives/repeat.js";
import "../focus-group/focus-group.ts";
import Tooltip from "../tooltip/tooltip.ts";

const meta = {
  title: "Components/Button",
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
  render: ({ onclick, textContent, ariaLabel }) => html`
    <button
      class="icon"
      @click=${onclick}
      aria-label=${ifDefined(ariaLabel)}
      ${ref((el) => {
        if (el) Tooltip.lazy(el);
      })}
    >
      <material-symbol aria-hidden="true">${textContent}</material-symbol>
    </button>
  `,
  args: {
    textContent: "home",
    ariaLabel: "home",
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
