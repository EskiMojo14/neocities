import type { Meta, StoryObj } from "@storybook/web-components-vite";
import "./header.ts";

const meta = {
  title: "Components/Header",
  tags: ["autodocs"],
  component: "page-header",
  args: {
    published: `"${new Date().toISOString()}"`,
    header: "header",
    subtitle: "subtitle",
  },
} satisfies Meta<HTMLElementTagNameMap["page-header"]>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
