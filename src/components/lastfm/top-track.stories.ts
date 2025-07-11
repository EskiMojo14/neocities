import type { Meta, StoryObj } from "@storybook/web-components-vite";
import "./top-track.ts";

const meta = {
  title: "Components/LastFM/Top Track",
  tags: ["autodocs"],
  component: "top-track",
  args: {
    artist: "Dirty Loops",
    name: "When The Time Is Right",
    thumbnail:
      "https://lastfm.freetls.fastly.net/i/u/174s/14d1fe21a22a2e4eca73353ce613d555.jpg",
    playcount: 100,
    rank: 1,
  },
} satisfies Meta<HTMLElementTagNameMap["top-track"]>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
