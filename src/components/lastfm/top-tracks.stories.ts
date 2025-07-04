import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "./top-tracks.ts";

const meta = {
  title: "Components/LastFM/Top Tracks",
  tags: ["autodocs"],
  component: "top-tracks",
  render: () => html`<top-tracks></top-tracks>`,
} satisfies Meta<HTMLElementTagNameMap["top-tracks"]>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
