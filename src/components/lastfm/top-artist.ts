import { html, LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import base from "../../styles/utility/baseline.css?type=raw";
import track from "./artist.css?type=raw";

@customElement("top-artist")
export default class TopArtist extends LitElement {
  static styles = [unsafeCSS(base), unsafeCSS(track)];

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
      <div class="info">
        <h3 class="headline6">
          <material-symbol aria-hidden="true">artist</material-symbol>${this
            .name}
        </h3>
        <p class="body2">
          <material-symbol aria-hidden="true">music_history</material-symbol
          >${this.playcount} plays
        </p>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "top-artist": TopArtist;
  }
}
