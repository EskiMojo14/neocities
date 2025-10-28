import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { ref } from "lit/directives/ref.js";
import { repeat } from "lit/directives/repeat.js";
import { fn } from "storybook/test";
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
  argTypes: {
    ariaPressed: {
      control: "boolean",
    },
  },
} satisfies Meta<HTMLButtonElement>;

export default meta;

type Story = StoryObj<HTMLButtonElement & { variant?: "outlined" | "filled" }>;

export const Default: Story = {};

export const Outlined: Story = {
  args: {
    className: "outlined",
  },
};

export const Filled: Story = {
  args: {
    className: "filled",
  },
};

export const Icon: Story = {
  render: ({ onclick, textContent, ariaLabel, variant, ariaPressed }) => html`
    <button
      class="icon ${variant}"
      @click=${onclick}
      aria-label=${ifDefined(ariaLabel)}
      aria-pressed=${ifDefined(ariaPressed)}
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
    variant: undefined,
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: [undefined, "outlined", "filled"],
    },
  },
};

export const Group: Story = {
  render: ({ onclick, textContent, variant }) => html`
    <focus-group class="button-group ${variant}">
      ${repeat(
        Array.from({ length: 3 }, (_, i) => i),
        (i) => i,
        (i) => html`<button @click=${onclick}>${textContent}${i}</button> `,
      )}
    </focus-group>
  `,
  args: {
    variant: "outlined",
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["text", "outlined", "filled"],
    },
  },
};
