import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { repeat } from "lit/directives/repeat.js";
import "./top-track.ts";
import "../track-list.css";

const meta = {
  title: "Components/Track/Top",
  tags: ["autodocs"],
  component: "top-track",
  render: (args) => html`
    <h4 class="headline6">Top tracks</h4>
    <ol class="track-list">
      ${repeat(
        Array.from({ length: 6 }, (_, i) => i),
        (i) => i,
        (i) =>
          html`<top-track
              role="listitem"
              .artist=${args.artist}
              .name=${args.name}
              .thumbnail=${args.thumbnail}
              .rank=${i + 1}
              .playcount=${args.playcount}
            ></top-track>
            <hr class="inset" />`,
      )}
    </ol>
  `,
  args: {
    artist: "Dirty Loops",
    name: "When The Time Is Right",
    thumbnail:
      "https://lastfm.freetls.fastly.net/i/u/174s/14d1fe21a22a2e4eca73353ce613d555.jpg",
    playcount: 100,
  },
} satisfies Meta<HTMLElementTagNameMap["top-track"]>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
