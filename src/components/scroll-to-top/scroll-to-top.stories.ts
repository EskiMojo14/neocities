import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import "../../scripts/page-scroll.ts";
import "./scroll-to-top.ts";

const meta = {
  title: "Components/Scroll To Top",
  tags: ["autodocs"],
  component: "scroll-to-top",
  render: () =>
    html`<div style="height: 150vh"></div>
      <scroll-to-top></scroll-to-top>`,
} satisfies Meta<HTMLElementTagNameMap["scroll-to-top"]>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
