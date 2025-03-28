import type { Meta, StoryObj } from "@storybook/web-components";

const meta = {
  title: "Components/Link",
  tags: ["autodocs"],
  component: "a",
  args: {
    textContent: "link",
    href: "#",
  },
} satisfies Meta<HTMLAnchorElement>;

export default meta;

type Story = StoryObj<HTMLAnchorElement>;

export const Default: Story = {};
