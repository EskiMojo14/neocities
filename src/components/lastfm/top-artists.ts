import { html, LitElement, unsafeCSS } from "lit";
import { customElement, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { repeat } from "lit/directives/repeat.js";
import { when } from "lit/directives/when.js";
import { QueryController } from "../../controllers/query-controller.ts";
import {
  fullPeriodLabels,
  getTopArtists,
  type Period,
  periodLabels,
  periodSchema,
} from "../../data/lastfm.ts";
import { StyleWatcher } from "../../mixins/style-watcher.ts";
import base from "../../styles/utility/baseline.css?type=raw";
import { toggleButton } from "../button/toggle.ts";
import "../spinner/spinner.ts";
import list from "./list.css?type=raw";
import "./top-artist.ts";

@customElement("top-artists")
export default class TopArtists extends StyleWatcher(LitElement) {
  static styles = [unsafeCSS(base), unsafeCSS(list)];

  @state()
  period: Period = "overall";

  #fetchArtists = new QueryController(this, () => ({
    ...getTopArtists({ period: this.period, limit: 5 }),
    enabled: typeof window !== "undefined",
  }));

  render(): unknown {
    return html`
      <h4 class="headline5">Top artists</h4>
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
                  name: "top-artists-period",
                  value: period,
                  checked: period === this.period,
                  ariaLabel: fullPeriodLabels[period],
                },
              ),
          )}
        </fieldset>
      </div>
      <ol class="list">
        ${this.#fetchArtists.render({
          initialOrPending: () =>
            repeat(
              Array(5),
              () => "skeleton",
              (_, index) =>
                html`<top-artist-skeleton></top-artist-skeleton>${when(
                    index < 4,
                    () => html`<hr class="inset" />`,
                  )}`,
            ),
          success: ({ data: artists }) =>
            repeat(
              artists,
              (artist) => artist.name,
              (artist, index) =>
                html`<top-artist
                    role="listitem"
                    name=${artist.name}
                    thumbnail=${ifDefined(artist.image.large)}
                    rank=${artist.rank}
                    playcount=${artist.playcount}
                  ></top-artist>
                  ${when(
                    index < artists.length - 1,
                    () => html`<hr class="inset" />`,
                  )}`,
            ),
          error: () =>
            html`<p class="error body2">Failed to load top artists</p>`,
        })}
      </ol>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "top-artists": TopArtists;
  }
}
