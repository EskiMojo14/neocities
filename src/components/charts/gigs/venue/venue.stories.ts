import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import "./venue.ts";

const meta = {
  title: "Components/Charts/Gigs by Venue",
  tags: ["autodocs"],
  component: "gigs-by-venue",
  render: () => html`<gigs-by-venue></gigs-by-venue>`,
} satisfies Meta<HTMLElementTagNameMap["gigs-by-venue"]>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
