import { html, LitElement, nothing, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { QueryController } from "../../controllers/query-controller.ts";
import { getUserData, type UserData } from "../../data/lastfm.ts";
import { withStyle } from "../../mixins/page-style.ts";
import base from "../../styles/utility/baseline.css?type=raw";
import { decimalFormat, unsafeEntries } from "../../utils/index.ts";
import "../skeleton/text-skeleton.ts";

const userDataChips: Record<
  keyof UserData,
  { icon: string; placeholder: string; label: string }
> = {
  playcount: {
    icon: "music_history",
    placeholder: "000,000",
    label: "scrobbles",
  },
  artist_count: { icon: "artist", placeholder: "0,000", label: "artists" },
  album_count: { icon: "album", placeholder: "00,000", label: "albums" },
  track_count: { icon: "music_note", placeholder: "00,000", label: "tracks" },
};

@customElement("scrobble-data")
export default class ScrobbleData extends withStyle(LitElement) {
  static styles = [unsafeCSS(base)];

  #fetchData = new QueryController(this, () => getUserData());

  render(): unknown {
    if (typeof window === "undefined") return nothing;
    return this.#fetchData.render({
      pending: () =>
        html`<ul class="chip-collection">
          ${repeat(
            unsafeEntries(userDataChips),
            ([key]) => key,
            ([, value]) =>
              html`<li class="chip body2">
                <material-symbol aria-hidden="true"
                  >${value.icon}</material-symbol
                >
                <text-skeleton>${value.placeholder}</text-skeleton>
                ${value.label}
              </li>`,
          )}
        </ul>`,
      success: ({ data }) =>
        html`<ul class="chip-collection">
          ${repeat(
            unsafeEntries(userDataChips),
            ([key]) => key,
            ([key, value]) =>
              html`<li class="chip body2">
                <material-symbol aria-hidden="true"
                  >${value.icon}</material-symbol
                >
                <span aria-label=${decimalFormat(data[key], "normal")}>
                  ${decimalFormat(data[key], this.pageStyle)}
                </span>
                ${value.label}
              </li>`,
          )}
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
