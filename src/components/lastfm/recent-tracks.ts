import { html, LitElement, nothing, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { repeat } from "lit/directives/repeat.js";
import { when } from "lit/directives/when.js";
import { QueryController } from "../../controllers/query-controller.ts";
import { getRecentTracks } from "../../data/lastfm.ts";
import base from "../../styles/utility/baseline.css?type=raw";
import "../spinner/spinner.ts";
import list from "./list.css?type=raw";
import "./recent-track.ts";

@customElement("recent-tracks")
export default class RecentTracks extends LitElement {
  static styles = [unsafeCSS(base), unsafeCSS(list)];

  #fetchTracks = new QueryController(this, () => getRecentTracks(5));

  render(): unknown {
    if (typeof window === "undefined") return nothing;
    return html`
      <h4 class="headline5">Recently played</h4>
      <ol class="list">
        ${this.#fetchTracks.render({
          pending: () =>
            repeat(
              Array(5),
              () => "skeleton",
              (_, index) =>
                html`<recent-track-skeleton></recent-track-skeleton>${when(
                    index < 4,
                    () => html`<hr class="inset" />`,
                  )}`,
            ),
          success: ({ data: tracks }) =>
            repeat(
              tracks,
              (track) => track.name,
              (track, index) =>
                html`<recent-track
                    role="listitem"
                    artist=${track.artist}
                    album=${track.album}
                    name=${track.name}
                    thumbnail=${ifDefined(track.image.large)}
                    date=${ifDefined(track.date)}
                    .nowPlaying=${track.nowPlaying}
                  ></recent-track>
                  ${when(
                    index < tracks.length - 1,
                    () => html`<hr class="inset" />`,
                  )}`,
            ),
          error: () =>
            html`<p class="error body2">Failed to load recent tracks</p>`,
        })}
      </ol>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "recent-tracks": RecentTracks;
  }
}
