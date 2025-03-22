import { fn } from "@storybook/test";
import type { Meta, StoryObj } from "@storybook/web-components";

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
