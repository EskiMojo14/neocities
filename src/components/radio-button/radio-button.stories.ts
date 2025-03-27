import { fn } from "@storybook/test";
import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { radioButton } from "./radio-button.ts";

const meta = {
  title: "Radio Button",
  tags: ["autodocs"],
  component: "radio-button",
  render: ({ onchange }) => html`
    <fieldset @change=${onchange} class="radio-button-group">
      ${radioButton(
        html`<material-symbol aria-hidden="true">home</material-symbol> home`,
        { name: "radio", value: "1" },
      )}
      ${radioButton(
        html`<material-symbol aria-hidden="true">house</material-symbol> house`,
        { name: "radio", value: "2" },
      )}
    </fieldset>
  `,
  args: {
    onchange: fn(),
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
