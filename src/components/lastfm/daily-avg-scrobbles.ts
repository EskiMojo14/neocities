import { html, LitElement, unsafeCSS } from "lit";
import { consume } from "@lit/context";
import { customElement } from "lit/decorators.js";
import { renderQueryResult } from "../../utils/query.ts";
import { getUserData } from "../../data/lastfm.ts";
import { stylePref, type Style } from "../../constants/prefs.ts";
import base from "../../styles/utility/baseline.css?type=raw";
import { decimalFormat } from "../../utils/index.ts";
import "../skeleton/text-skeleton.ts";
import "../spinner/spinner.ts";
import { createQueryController } from "@tanstack/lit-query";

const startDate = new Date("2017-09-22");
const oneDay = 1000 * 60 * 60 * 24;

@customElement("daily-avg-scrobbles")
export default class DailyAvgScrobbles extends LitElement {
  static styles = [unsafeCSS(base)];

  @consume({ context: stylePref.context, subscribe: true })
  pageStyle: Style = stylePref.fallback;

  #fetchPlaycount = createQueryController(this, {
    ...getUserData(),
    enabled: typeof window !== "undefined",
    select: (data) => {
      const msSince = Date.now() - startDate.getTime();
      const daysSince = msSince / oneDay;
      return Math.round(data.playcount / daysSince);
    },
  });

  render(): unknown {
    return renderQueryResult(this.#fetchPlaycount, {
      pending: () => html` (an average of <text-skeleton>00</text-skeleton> scrobbles per day) `,
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
