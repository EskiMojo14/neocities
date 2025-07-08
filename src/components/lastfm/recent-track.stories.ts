import type { Meta, StoryObj } from "@storybook/web-components-vite";
import "./recent-track.ts";

const meta = {
  title: "Components/LastFM/Recent Track",
  tags: ["autodocs"],
  component: "recent-track",
  args: {
    artist: "Dirty Loops",
    name: "When The Time Is Right",
    thumbnail:
      "https://lastfm.freetls.fastly.net/i/u/174s/14d1fe21a22a2e4eca73353ce613d555.jpg",
    date: "2025-07-03T16:29:47.000Z",
    nowPlaying: false,
  },
} satisfies Meta<HTMLElementTagNameMap["recent-track"]>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
