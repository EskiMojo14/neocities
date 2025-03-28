import type { Meta, StoryObj } from "@storybook/web-components";
import "./footer.ts";

const meta = {
  title: "Components/Footer",
  tags: ["autodocs"],
  component: "page-footer",
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<HTMLElementTagNameMap["page-footer"]>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
