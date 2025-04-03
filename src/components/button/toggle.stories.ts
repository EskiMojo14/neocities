import { fn } from "@storybook/test";
import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import Tooltip from "../tooltip/tooltip.ts";
import type { ToggleButton } from "./toggle.ts";
import { toggleButton } from "./toggle.ts";

const meta = {
  title: "Components/Button/Toggle",
  tags: ["autodocs"],
  component: "toggle-button",
  argTypes: {
    type: {
      control: "inline-radio",
      options: ["radio", "checkbox"],
    },
    variant: {
      control: "inline-radio",
      options: ["text", "outlined", "filled"],
    },
  },
  args: {
    type: "radio",
    onchange: fn(),
    variant: "text",
  },
} satisfies Meta<ToggleButton & { variant?: "text" | "outlined" | "filled" }>;

export default meta;

type Story = StoryObj<ToggleButton & { variant?: "outlined" | "filled" }>;

export const Default: Story = {
  render: ({ type, onchange, variant }) => html`
    <fieldset @change=${onchange} class="button-group ${variant}">
      ${toggleButton(
        html`<material-symbol aria-hidden="true">home</material-symbol> Home`,
        { type, name: "toggle", value: "1", checked: true },
      )}
      ${toggleButton(
        html`<material-symbol aria-hidden="true">house</material-symbol> House`,
        { type, name: "toggle", value: "2" },
      )}
    </fieldset>
  `,
};

export const Icon: Story = {
  render: ({ type, onchange, variant }) => html`
    <fieldset @change=${onchange} class="button-group ${variant}">
      ${toggleButton(
        html`<material-symbol aria-hidden="true">home</material-symbol>`,
        {
          type,
          name: "toggle",
          value: "1",
          className: "icon",
          checked: true,
          ariaLabel: "Home",
          ref(el) {
            if (el) Tooltip.lazy(el);
          },
        },
      )}
      ${toggleButton(
        html`<material-symbol aria-hidden="true">house</material-symbol>`,
        {
          type,
          name: "toggle",
          value: "2",
          className: "icon",
          ariaLabel: "House",
          ref(el) {
            if (el) Tooltip.lazy(el);
          },
        },
      )}
    </fieldset>
  `,
};
