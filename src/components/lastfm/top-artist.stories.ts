import type { Meta, StoryObj } from "@storybook/web-components-vite";
import "./top-artist.ts";

const meta = {
  title: "Components/LastFM/Top Artist",
  tags: ["autodocs"],
  component: "top-artist",
  args: {
    name: "Dirty Loops",
    thumbnail:
      "https://lastfm.freetls.fastly.net/i/u/174s/14d1fe21a22a2e4eca73353ce613d555.jpg",
    playcount: 100,
    rank: 1,
  },
} satisfies Meta<HTMLElementTagNameMap["top-artist"]>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
