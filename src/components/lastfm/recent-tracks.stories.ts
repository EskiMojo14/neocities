import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "./recent-tracks.ts";

const meta = {
  title: "Components/LastFM/Recent Tracks",
  tags: ["autodocs"],
  component: "recent-tracks",
  render: () => html`<recent-tracks></recent-tracks>`,
} satisfies Meta<HTMLElementTagNameMap["recent-tracks"]>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
