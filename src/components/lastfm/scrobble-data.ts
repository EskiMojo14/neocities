import { Task } from "@lit/task";
import { html, LitElement, unsafeCSS } from "lit";
import { customElement, state } from "lit/decorators.js";
import type { Style } from "../../constants/prefs.ts";
import { stylePref } from "../../constants/prefs.ts";
import { getUserData } from "../../data/lastfm.ts";
import { queryClient } from "../../data/query.ts";
import base from "../../styles/utility/baseline.css?type=raw";
import { decimalFormat } from "../../utils/index.ts";
import "../spinner/spinner.ts";
import scrobbleData from "./scrobble-data.css?type=raw";

@customElement("scrobble-data")
export default class ScrobbleData extends LitElement {
  static styles = [unsafeCSS(base), unsafeCSS(scrobbleData)];

  #fetchData = new Task(this, {
    args: () => [],
    task: (_, { signal }) => queryClient.fetchQuery(getUserData(signal)),
  });

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
    return this.#fetchData.render({
      pending: () => html`<hourglass-spinner></hourglass-spinner>`,
      complete: (data) =>
        html`<p class="body2">
            <material-symbol aria-hidden="true">music_history</material-symbol>
            ${decimalFormat(data.playcount, this.pageStyle)} scrobbles
          </p>
          <p class="body2">
            <material-symbol aria-hidden="true">artist</material-symbol>
            ${decimalFormat(data.artist_count, this.pageStyle)} artists
          </p>
          <p class="body2">
            <material-symbol aria-hidden="true">album</material-symbol>
            ${decimalFormat(data.album_count, this.pageStyle)} albums
          </p>
          <p class="body2">
            <material-symbol aria-hidden="true">music_note</material-symbol>
            ${decimalFormat(data.track_count, this.pageStyle)} tracks
          </p>`,
      error: () => "Failed to load scrobble data",
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "scrobble-data": ScrobbleData;
  }
}
