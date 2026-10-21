import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import "./city.ts";

const meta = {
  title: "Components/Charts/Gigs by City",
  tags: ["autodocs"],
  component: "gigs-by-city",
  render: () => html`<gigs-by-city></gigs-by-city>`,
} satisfies Meta<HTMLElementTagNameMap["gigs-by-city"]>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
