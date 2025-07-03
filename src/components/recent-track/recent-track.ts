import { html, LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { when } from "lit/directives/when.js";
import base from "../../styles/utility/baseline.css?type=raw";
import "../date-format/date-format.ts";
import recentTrack from "./recent-track.css?type=raw";

@customElement("recent-track")
export default class RecentTrack extends LitElement {
  static styles = [unsafeCSS(base), unsafeCSS(recentTrack)];

  @property({ type: String })
  artist = "";

  @property({ type: String })
  album = "";

  @property({ type: String })
  name = "";

  @property({ type: String })
  thumbnail = "";

  @property({ type: Boolean, attribute: "now-playing" })
  nowPlaying = false;

  @property({ type: String })
  date = "";

  render() {
    return html`
      ${when(this.thumbnail, (src) => html`<img src="${src}" alt="" />`)}
      <ul class="info">
        ${when(
          this.nowPlaying,
          () =>
            html`<li class="date body2 now-playing">
              <material-symbol class="date" aria-hidden="true"
                >today</material-symbol
              >
              Now playing
            </li>`,
          () =>
            html`<li class="date body2">
              <material-symbol class="date" aria-label="Scrobble date"
                >event</material-symbol
              >
              <date-format class="body2" date="${this.date}"></date-format>
            </li>`,
        )}
        <li class="body2">
          <material-symbol class="track" aria-label="Track"
            >music_note</material-symbol
          >
          ${this.name}
        </li>
        <li class="body2">
          <material-symbol class="artist" aria-label="Artist"
            >artist</material-symbol
          >${this.artist}
        </li>
        <li class="body2">
          <material-symbol class="album" aria-label="Album"
            >album</material-symbol
          >${this.album}
        </li>
      </ul>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "recent-track": RecentTrack;
  }
}
