import { html, LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { searchLinks } from "../../data/music.ts";
import { StyleWatcher } from "../../mixins/style-watcher.ts";
import base from "../../styles/utility/baseline.css?type=raw";
import { decimalFormat } from "../../utils/index.ts";
import "../focus-group/focus-group.ts";
import track from "./track.css?type=raw";

@customElement("top-track")
export default class TopTrack extends StyleWatcher(LitElement) {
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
          <span>${this.artist}</span>
        </li>
        <li class="headline6">
          <material-symbol aria-label="Track">music_note</material-symbol>
          <span>${this.name}</span>
        </li>
        <li class="body2">
          <material-symbol aria-hidden="true">music_history</material-symbol>
          <span>
            <span aria-label=${decimalFormat(this.playcount, "normal")}>
              ${decimalFormat(this.playcount, this.pageStyle)}
            </span>
            plays</span
          >
        </li>
      </ul>
      <focus-group>
        ${repeat(
          searchLinks,
          (link) => link.label,
          (link) =>
            html`<a
              href=${link.getLink(this.name + " " + this.artist)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Search ${link.label} for ${this.name} by ${this
                .artist}"
            >
              <material-symbol aria-hidden="true">${link.icon}</material-symbol>
            </a>`,
        )}
      </focus-group>
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
