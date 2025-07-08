import { html, LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { withStyle } from "../../mixins/page-style.ts";
import base from "../../styles/utility/baseline.css?type=raw";
import { decimalFormat } from "../../utils/index.ts";
import track from "./track.css?type=raw";

@customElement("top-track")
export default class TopTrack extends withStyle(LitElement) {
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
          <span aria-label=${decimalFormat(this.playcount, "normal")}>
            ${decimalFormat(this.playcount, this.pageStyle)}
          </span>
          plays
        </li>
      </ul>
    `;
  }
}

@customElement("top-track-skeleton")
export class TopTrackSkeleton extends LitElement {
  static styles = [unsafeCSS(base), unsafeCSS(track)];

  render() {
    return html`
      <material-symbol aria-hidden="true">counter_1</material-symbol>
      <ul class="info">
        <li class="caption">
          <material-symbol aria-hidden="true">artist</material-symbol>
          <text-skeleton>Artist name</text-skeleton>
        </li>
        <li class="headline6">
          <material-symbol aria-hidden="true">music_note</material-symbol>
          <text-skeleton>Track name</text-skeleton>
        </li>
        <li class="body2">
          <material-symbol aria-hidden="true">music_history</material-symbol>
          <text-skeleton>000,000</text-skeleton>
          plays
        </li>
      </ul>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "top-track": TopTrack;
    "top-track-skeleton": TopTrackSkeleton;
  }
}
