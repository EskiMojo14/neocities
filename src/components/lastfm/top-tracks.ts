import { html, LitElement, nothing, unsafeCSS } from "lit";
import { customElement, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { repeat } from "lit/directives/repeat.js";
import { when } from "lit/directives/when.js";
import { QueryController } from "../../controllers/query-controller.ts";
import {
  fullPeriodLabels,
  getTopTracks,
  type Period,
  periodLabels,
  periodSchema,
} from "../../data/lastfm.ts";
import { withStyle } from "../../mixins/page-style.ts";
import base from "../../styles/utility/baseline.css?type=raw";
import { toggleButton } from "../button/toggle.ts";
import "../spinner/spinner.ts";
import list from "./list.css?type=raw";
import "./top-track.ts";

@customElement("top-tracks")
export default class TopTracks extends withStyle(LitElement) {
  static styles = [unsafeCSS(base), unsafeCSS(list)];

  @state()
  period: Period = "overall";

  #fetchTracks = new QueryController(this, () =>
    getTopTracks.queryOptions({
      period: this.period,
      limit: 5,
    }),
  );

  render(): unknown {
    if (typeof window === "undefined") return nothing;
    return html`
      <h4 class="headline5">Top tracks</h4>
      <div class="button-group-container">
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
              toggleButton(
                (this.pageStyle === "normal" ? fullPeriodLabels : periodLabels)[
                  period
                ],
                {
                  name: "top-tracks-period",
                  value: period,
                  checked: period === this.period,
                  ariaLabel: fullPeriodLabels[period],
                },
              ),
          )}
        </fieldset>
      </div>
      <ol class="list">
        ${this.#fetchTracks.render({
          pending: () =>
            repeat(
              Array(5),
              () => "skeleton",
              (_, index) =>
                html`<top-track-skeleton></top-track-skeleton>${when(
                    index < 4,
                    () => html`<hr class="inset" />`,
                  )}`,
            ),
          success: ({ data: tracks }) =>
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
