import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import "./artist.ts";

const meta = {
  title: "Components/Charts/Gigs by Artist",
  tags: ["autodocs"],
  component: "gigs-by-artist",
  render: () => html`<gigs-by-artist></gigs-by-artist>`,
} satisfies Meta<HTMLElementTagNameMap["gigs-by-artist"]>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
