import { fn } from "@storybook/test";
import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import Tooltip from "../tooltip/tooltip.ts";
import type { ToggleButton } from "./toggle.ts";
import { toggleButton } from "./toggle.ts";

const meta = {
  title: "Button/Toggle",
  tags: ["autodocs"],
  component: "toggle-button",
  argTypes: {
    type: {
      control: "inline-radio",
      options: ["radio", "checkbox"],
    },
  },
  args: {
    type: "radio",
    onchange: fn(),
  },
} satisfies Meta<ToggleButton>;

export default meta;

type Story = StoryObj<ToggleButton>;

export const Default: Story = {
  render: ({ type, onchange }) => html`
    <fieldset @change=${onchange} class="button-group">
      ${toggleButton(
        html`<material-symbol aria-hidden="true">home</material-symbol> home`,
        { type, name: "toggle", value: "1", checked: true },
      )}
      ${toggleButton(
        html`<material-symbol aria-hidden="true">house</material-symbol> house`,
        { type, name: "toggle", value: "2" },
      )}
    </fieldset>
  `,
};

export const Outlined: Story = {
  render: ({ type, onchange }) => html`
    <fieldset @change=${onchange} class="button-group outlined">
      ${toggleButton(
        html`<material-symbol aria-hidden="true">home</material-symbol> home`,
        { type, name: "toggle", value: "1", checked: true },
      )}
      ${toggleButton(
        html`<material-symbol aria-hidden="true">house</material-symbol> house`,
        { type, name: "toggle", value: "2" },
      )}
    </fieldset>
  `,
};

export const Icon: Story = {
  render: ({ type, onchange }) => html`
    <fieldset @change=${onchange} class="button-group">
      ${toggleButton(
        html`<material-symbol aria-hidden="true">home</material-symbol>`,
        {
          type,
          name: "toggle",
          value: "1",
          className: "icon",
          checked: true,
          ref(el) {
            if (el) Tooltip.lazy(el, "home");
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
          ref(el) {
            if (el) Tooltip.lazy(el, "house");
          },
        },
      )}
    </fieldset>
  `,
};
