import { html, LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import base from "../../styles/utility/baseline.css?type=raw";
import track from "./track.css?type=raw";

@customElement("top-track")
export default class TopTrack extends LitElement {
  static styles = [unsafeCSS(base), unsafeCSS(track)];

  @property({ type: String })
  artist = "";

  @property({ type: String })
  name = "";

  @property({ type: String })
  thumbnail = "";

  @property({ type: Number })
  rank = 0;

  @property({ type: Number })
  playcount = 0;

  render() {
    return html`
      <material-symbol aria-label="Rank ${this.rank}"
        >counter_${this.rank}</material-symbol
      >
      <ul class="info">
        <li class="caption">
          <material-symbol aria-label="Artist">artist</material-symbol>
          ${this.artist}
        </li>
        <li class="headline6">
          <material-symbol aria-label="Track">music_note</material-symbol>
          ${this.name}
        </li>
        <li class="body2">
          <material-symbol aria-hidden="true">music_history</material-symbol>
          ${this.playcount} plays
        </li>
      </ul>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "top-track": TopTrack;
  }
}
