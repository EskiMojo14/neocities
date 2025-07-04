import { html, LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { when } from "lit/directives/when.js";
import base from "../../styles/utility/baseline.css?type=raw";
import { clsx } from "../../utils/lit.ts";
import "../date-format/date-format.ts";
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
        ${when(
          this.nowPlaying,
          () =>
            html`<li class="body2">
              <material-symbol aria-hidden="true">today</material-symbol>
              Now playing
            </li>`,
          () =>
            html`<li class="body2">
              <material-symbol aria-label="Scrobble date"
                >event</material-symbol
              >
              <date-format class="body2" date="${this.date}"></date-format>
            </li>`,
        )}
        <li class="body2">
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

declare global {
  interface HTMLElementTagNameMap {
    "recent-track": RecentTrack;
  }
}
