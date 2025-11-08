import { html, LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { searchLinks } from "../../data/music.ts";
import { StyleWatcher } from "../../mixins/style-watcher.ts";
import base from "../../styles/utility/baseline.css?type=raw";
import { decimalFormat } from "../../utils/index.ts";
import "../focus-group/focus-group.ts";
import "../skeleton/text-skeleton.ts";
import track from "./artist.css?type=raw";

@customElement("top-artist")
export default class TopArtist extends StyleWatcher(LitElement) {
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
          <material-symbol aria-hidden="true">artist</material-symbol>
          <span>${this.name}</span>
        </h3>
        <p class="body2">
          <material-symbol aria-hidden="true">music_history</material-symbol>
          <span>
            <span aria-label=${decimalFormat(this.playcount, "normal")}>
              ${decimalFormat(this.playcount, this.pageStyle)}
            </span>
            plays</span
          >
        </p>
      </div>
      <focus-group>
        ${repeat(
          searchLinks,
          (link) => link.label,
          (link) =>
            html`<a
              href=${link.getLink(this.name)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Search ${link.label} for ${this.name}"
            >
              <material-symbol aria-hidden="true">${link.icon}</material-symbol>
            </a>`,
        )}
      </focus-group>
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
