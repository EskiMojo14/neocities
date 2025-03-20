import type { Meta, StoryObj } from "@storybook/web-components";
import "./sidebar.ts";

const meta = {
  title: "Sidebar",
  tags: ["autodocs"],
  component: "sidebar-nav",
} satisfies Meta<HTMLElementTagNameMap["sidebar-nav"]>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
