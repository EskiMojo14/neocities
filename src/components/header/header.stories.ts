import type { Meta, StoryObj } from "@storybook/web-components";
import "./header.ts";

const meta = {
  title: "Header",
  tags: ["autodocs"],
  component: "page-header",
  args: {
    innerText: "Page header",
  },
} satisfies Meta<HTMLElementTagNameMap["page-header"]>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
