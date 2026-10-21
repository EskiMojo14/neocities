import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import "./tabs.ts";

const meta = {
  title: "Components/Charts/Gig Tabs",
  tags: ["autodocs"],
  component: "gigs-tabs",
  render: () => html`<gigs-tabs></gigs-tabs>`,
} satisfies Meta<HTMLElementTagNameMap["gigs-tabs"]>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
