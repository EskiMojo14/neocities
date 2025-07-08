import type { Meta, StoryObj } from "@storybook/web-components-vite";

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
