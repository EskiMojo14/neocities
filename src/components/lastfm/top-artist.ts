import { html, LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { withStyle } from "../../mixins/page-style.ts";
import base from "../../styles/utility/baseline.css?type=raw";
import { decimalFormat } from "../../utils/index.ts";
import "../skeleton/text-skeleton.ts";
import track from "./artist.css?type=raw";

@customElement("top-artist")
export default class TopArtist extends withStyle(LitElement) {
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
          <material-symbol aria-hidden="true">music_history</material-symbol>
          <span aria-label=${decimalFormat(this.playcount, "normal")}>
            ${decimalFormat(this.playcount, this.pageStyle)}
          </span>
          plays
        </p>
      </div>
    `;
  }
}

@customElement("top-artist-skeleton")
export class TopArtistSkeleton extends LitElement {
  static styles = [unsafeCSS(base), unsafeCSS(track)];

  render() {
    return html`
      <material-symbol aria-hidden="true">counter_1</material-symbol>
      <div class="info">
        <h3 class="headline6">
          <material-symbol aria-hidden="true">artist</material-symbol>
          <text-skeleton>Artist name</text-skeleton>
        </h3>
        <p class="body2">
          <material-symbol aria-hidden="true">music_history</material-symbol>
          <text-skeleton>000,000</text-skeleton>
          plays
        </p>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "top-artist": TopArtist;
    "top-artist-skeleton": TopArtistSkeleton;
  }
}
