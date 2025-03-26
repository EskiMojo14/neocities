import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "./tooltip.ts";

const meta = {
  title: "Tooltip",
  tags: ["autodocs"],
  component: "tool-tip",
  render: ({ offset, text }) => html`
    <button>button</button>
    <tool-tip offset=${offset} text=${text}></tool-tip>
  `,
  args: {
    offset: 4,
    text: "tooltip",
  },
} satisfies Meta<HTMLElementTagNameMap["tool-tip"]>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
