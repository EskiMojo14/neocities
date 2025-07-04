import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { repeat } from "lit/directives/repeat.js";
import "./recent-track.ts";
import "../track-list.css";

const meta = {
  title: "Components/Track/Recent",
  tags: ["autodocs"],
  component: "recent-track",
  render: (args) => html`
    <h4 class="headline6">Recently played</h4>
    <ol class="track-list">
      ${repeat(
        Array.from({ length: 6 }, (_, i) => i),
        (i) => i,
        () =>
          html`<recent-track
              role="listitem"
              .artist=${args.artist}
              .name=${args.name}
              .thumbnail=${args.thumbnail}
              .date=${args.date}
              .nowPlaying=${args.nowPlaying}
            ></recent-track>
            <hr class="inset" />`,
      )}
    </ol>
  `,
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
