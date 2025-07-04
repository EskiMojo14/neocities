import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { styleMap } from "../../utils/lit.ts";

const meta = {
  title: "Components/Chip",
  tags: ["autodocs"],
  render: ({ textContent, icon, color, fillIcon }) => html`
    <ul
      class="chip-collection"
      style=${styleMap({
        "--icon-fill": fillIcon ? 1 : 0,
      })}
    >
      <li class="chip body2" style=${styleMap({ "--icon-color": color })}>
        <material-symbol aria-hidden="true">${icon}</material-symbol>
        ${textContent}
      </li>
      <li class="chip body2" style=${styleMap({ "--icon-color": color })}>
        <material-symbol aria-hidden="true">${icon}</material-symbol>
        ${textContent}
      </li>
    </ul>
  `,
  args: {
    textContent: "Chip",
    icon: "home",
    color: undefined,
    fillIcon: false,
  },
  argTypes: {
    color: {
      control: "color",
    },
  },
} satisfies Meta<{
  textContent: string;
  icon: string;
  color: string;
  fillIcon: boolean;
}>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
