import { html, LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { when } from "lit/directives/when.js";
import base from "../../styles/utility/baseline.css?type=raw";
import { clsx } from "../../utils/lit.ts";
import "../date-format/date-format.ts";
import "../skeleton/text-skeleton.ts";
import track from "./track.css?type=raw";

@customElement("recent-track")
export default class RecentTrack extends LitElement {
  static styles = [unsafeCSS(base), unsafeCSS(track)];

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
      <material-symbol aria-hidden="true">music_history</material-symbol>
      ${when(this.thumbnail, (src) => html`<img src="${src}" alt="" />`)}
      <ul
        class=${clsx("info", {
          "now-playing": this.nowPlaying,
        })}
      >
        <li class="caption">
          ${when(
            this.nowPlaying,
            () => html`
              <material-symbol aria-hidden="true">today</material-symbol>
              Now playing
            `,
            () => html`
              <material-symbol aria-label="Scrobble date"
                >event</material-symbol
              >
              <date-format
                class="caption"
                date="${this.date}"
                show-time
              ></date-format>
            `,
          )}
        </li>
        <li class="headline6">
          <material-symbol aria-label="Track">music_note</material-symbol>
          ${this.name}
        </li>
        <li class="body2">
          <material-symbol aria-label="Artist">artist</material-symbol>${this
            .artist}
        </li>
      </ul>
    `;
  }
}

@customElement("recent-track-skeleton")
export class RecentTrackSkeleton extends LitElement {
  static styles = [unsafeCSS(base), unsafeCSS(track)];

  render() {
    return html`
      <material-symbol aria-hidden="true">music_history</material-symbol>
      <image-skeleton></image-skeleton>
      <ul class="info">
        <li class="caption">
          <material-symbol aria-hidden="true">event</material-symbol>
          <text-skeleton>
            <date-format date="1980-01-01T00:00:00.000Z" show-time>
            </date-format>
          </text-skeleton>
        </li>
        <li class="headline6">
          <material-symbol aria-hidden="true">music_note</material-symbol>
          <text-skeleton>Track name</text-skeleton>
        </li>
        <li class="body2">
          <material-symbol aria-hidden="true">artist</material-symbol>
          <text-skeleton>Artist name</text-skeleton>
        </li>
      </ul>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "recent-track": RecentTrack;
    "recent-track-skeleton": RecentTrackSkeleton;
  }
}
