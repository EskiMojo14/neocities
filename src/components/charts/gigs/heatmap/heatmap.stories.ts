import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import "./heatmap.ts";

const meta = {
  title: "Components/Charts/Gigs Year-Month Heatmap",
  tags: ["autodocs"],
  component: "gigs-year-month-heatmap",
  render: () => html`<gigs-year-month-heatmap></gigs-year-month-heatmap>`,
} satisfies Meta<HTMLElementTagNameMap["gigs-year-month-heatmap"]>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
