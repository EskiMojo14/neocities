import { Task } from "@lit/task";
import { html, LitElement, unsafeCSS } from "lit";
import { customElement, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { repeat } from "lit/directives/repeat.js";
import { when } from "lit/directives/when.js";
import {
  getTopTracks,
  type Period,
  periodSchema,
} from "../../../data/lastfm.ts";
import base from "../../../styles/utility/baseline.css?type=raw";
import { toggleButton } from "../../button/toggle.ts";
import "../../spinner/spinner.ts";
import trackList from "../track-list.css?type=raw";
import "./top-track.ts";

const periodLabels: Record<Period, string> = {
  "7day": "7 days",
  "1month": "30 days",
  "3month": "3 months",
  "6month": "6 months",
  "12month": "12 months",
  overall: "Overall",
};

@customElement("top-tracks")
export default class TopTracks extends LitElement {
  static styles = [unsafeCSS(base), unsafeCSS(trackList)];

  @state()
  period: Period = "overall";

  #fetchTracks = new Task(this, {
    args: () => [this.period],
    task: async ([period], { signal }) => getTopTracks(period, 5, { signal }),
  });

  render() {
    return html`
      <h4 class="headline6">Top tracks</h4>
      <fieldset
        class="button-group outlined"
        @change=${(ev: Event) => {
          this.period = (ev.target as HTMLInputElement).value as Period;
        }}
      >
        ${repeat(
          periodSchema.options,
          (period) => period,
          (period) =>
            toggleButton(periodLabels[period], {
              name: "top-tracks-period",
              value: period,
              checked: period === this.period,
            }),
        )}
      </fieldset>
      <ol class="track-list">
        ${this.#fetchTracks.render({
          pending: () => html`<hourglass-spinner></hourglass-spinner>`,
          complete: (tracks) =>
            repeat(
              tracks,
              (track) => track.name,
              (track, index) =>
                html`<top-track
                    role="listitem"
                    artist=${track.artist}
                    name=${track.name}
                    thumbnail=${ifDefined(track.image.large)}
                    rank=${track.rank}
                    playcount=${track.playcount}
                  ></top-track>
                  ${when(
                    index < tracks.length - 1,
                    () => html`<hr class="inset" />`,
                  )}`,
            ),
          error: () =>
            html`<p class="error body2">Failed to load top tracks</p>`,
        })}
      </ol>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "top-tracks": TopTracks;
  }
}
