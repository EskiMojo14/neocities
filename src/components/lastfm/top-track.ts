import { html, LitElement, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { Style } from "../../constants/prefs.ts";
import { stylePref } from "../../constants/prefs.ts";
import base from "../../styles/utility/baseline.css?type=raw";
import { decimalFormat } from "../../utils/index.ts";
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

  @state()
  pageStyle: Style = stylePref.fallback;

  eventAc: AbortController | undefined;

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener(
      "stylechange",
      (e) => (this.pageStyle = e.newStyle),
      {
        signal: (this.eventAc = new AbortController()).signal,
      },
    );
  }

  firstUpdated() {
    this.pageStyle = stylePref.data;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.eventAc?.abort();
  }

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
          ${decimalFormat(this.playcount, this.pageStyle)} plays
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
