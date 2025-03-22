import type { Meta, StoryObj } from "@storybook/web-components";
import "./header.ts";

const meta = {
  title: "Header",
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
