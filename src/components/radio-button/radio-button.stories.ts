import { fn } from "@storybook/test";
import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import Tooltip from "../tooltip/tooltip.ts";
import { radioButton } from "./radio-button.ts";

const meta = {
  title: "Radio Button",
  tags: ["autodocs"],
  component: "radio-button",
  args: {
    onchange: fn(),
  },
} satisfies Meta<HTMLElement>;

export default meta;

type Story = StoryObj<HTMLElement>;

export const Default: Story = {
  render: ({ onchange }) => html`
    <fieldset @change=${onchange} class="radio-button-group">
      ${radioButton(
        html`<material-symbol aria-hidden="true">home</material-symbol> home`,
        { name: "radio", value: "1", checked: true },
      )}
      ${radioButton(
        html`<material-symbol aria-hidden="true">house</material-symbol> house`,
        { name: "radio", value: "2" },
      )}
    </fieldset>
  `,
};

export const Icon: Story = {
  render: ({ onchange }) => html`
    <fieldset @change=${onchange} class="radio-button-group">
      ${radioButton(
        html`<material-symbol aria-hidden="true">home</material-symbol>`,
        {
          name: "radio",
          value: "1",
          className: "icon",
          checked: true,
          ref: (el) => {
            if (el) Tooltip.lazy(el, "home");
          },
        },
      )}
      ${radioButton(
        html`<material-symbol aria-hidden="true">house</material-symbol>`,
        {
          name: "radio",
          value: "2",
          className: "icon",
          ref: (el) => {
            if (el) Tooltip.lazy(el, "house");
          },
        },
      )}
    </fieldset>
  `,
};
