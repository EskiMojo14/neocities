import { html, LitElement, nothing, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";
import { QueryController } from "../../controllers/query-controller.ts";
import { getUserData } from "../../data/lastfm.ts";
import { withStyle } from "../../mixins/page-style.ts";
import base from "../../styles/utility/baseline.css?type=raw";
import { decimalFormat } from "../../utils/index.ts";
import "../skeleton/text-skeleton.ts";
import "../spinner/spinner.ts";

const startDate = new Date("2017-09-22");

@customElement("daily-avg-scrobbles")
export default class DailyAvgScrobbles extends withStyle(LitElement) {
  static styles = [unsafeCSS(base)];

  calculateDailyAvg(playcount: number) {
    return Math.round(
      playcount / ((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24)),
    );
  }

  #fetchPlaycount = new QueryController(this, () => ({
    ...getUserData(),
    select: (data) => this.calculateDailyAvg(data.playcount),
  }));

  render(): unknown {
    if (typeof window === "undefined") return nothing;
    return this.#fetchPlaycount.render({
      pending: () =>
        html` (an average of <text-skeleton>00</text-skeleton> scrobbles per
          day)`,
      success: ({ data }) =>
        html` (an average of
          <span aria-label=${decimalFormat(data, "normal")}>
            ${decimalFormat(data, this.pageStyle)}
          </span>
          scrobbles per day)`,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "daily-avg-scrobbles": DailyAvgScrobbles;
  }
}
