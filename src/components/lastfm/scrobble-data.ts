import { html, LitElement, nothing, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";
import { QueryController } from "../../controllers/query-controller.ts";
import { getUserData } from "../../data/lastfm.ts";
import { withStyle } from "../../mixins/page-style.ts";
import base from "../../styles/utility/baseline.css?type=raw";
import { decimalFormat } from "../../utils/index.ts";
import "../spinner/spinner.ts";

@customElement("scrobble-data")
export default class ScrobbleData extends withStyle(LitElement) {
  static styles = [unsafeCSS(base)];

  #fetchData = new QueryController(this, () => getUserData());

  render(): unknown {
    if (typeof window === "undefined") return nothing;
    return this.#fetchData.render({
      pending: () => html`<hourglass-spinner></hourglass-spinner>`,
      success: ({ data }) =>
        html`<ul class="chip-collection">
          <li class="chip body2">
            <material-symbol aria-hidden="true">music_history</material-symbol>
            <span aria-label=${decimalFormat(data.playcount, "normal")}>
              ${decimalFormat(data.playcount, this.pageStyle)}
            </span>
            scrobbles
          </li>
          <li class="chip body2">
            <material-symbol aria-hidden="true">artist</material-symbol>
            <span aria-label=${decimalFormat(data.artist_count, "normal")}>
              ${decimalFormat(data.artist_count, this.pageStyle)}
            </span>
            artists
          </li>
          <li class="chip body2">
            <material-symbol aria-hidden="true">album</material-symbol>
            <span aria-label=${decimalFormat(data.album_count, "normal")}>
              ${decimalFormat(data.album_count, this.pageStyle)}
            </span>
            albums
          </li>
          <li class="chip body2">
            <material-symbol aria-hidden="true">music_note</material-symbol>
            <span aria-label=${decimalFormat(data.track_count, "normal")}>
              ${decimalFormat(data.track_count, this.pageStyle)}
            </span>
            tracks
          </li>
        </ul>`,
      error: () => "Failed to load scrobble data",
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "scrobble-data": ScrobbleData;
  }
}
