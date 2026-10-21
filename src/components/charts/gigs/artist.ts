import { barX, defineChart } from "@tanstack/charts";
import { stack } from "@tanstack/charts/stack";
import { scaleBand } from "@tanstack/charts/scales/band";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { scaleOrdinal } from "@tanstack/charts/scales/ordinal";
import { tooltip } from "@tanstack/charts/tooltip";
import type { ChartTooltipBodyRenderContext } from "@tanstack/charts/lit";
import { html, LitElement, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";
import { consume } from "@lit/context";
import { stylePref, type Style } from "../../../constants/prefs.ts";
import { dateFormat } from "../../../utils/index.ts";
import { cache } from "../../../utils/lit.ts";
import base from "../../../styles/utility/baseline.css?type=raw";
import styles from "./artist.css?type=raw";
import { countArtistEvents } from "./artist-data.ts";
import { renderSvg } from "./svg.ts";
import gigs from "./gigs.json" with { type: "json" };
import "../register.ts";

const artists = countArtistEvents(gigs.events);
const roles = ["Main / co-billed", "Support"] as const;
const rows = artists.flatMap((artist) => [
  { ...artist, role: roles[0], count: artist.main },
  { ...artist, role: roles[1], count: artist.support },
]);
type ArtistRow = (typeof rows)[number];

const definition = defineChart({
  margin: { left: 280 },
  marks: [
    barX(rows, {
      id: "gigs-by-artist",
      x: "count",
      y: "artist",
      z: "role",
      color: "role",
      key: (row) => `${row.artist}:${row.role}`,
      layout: stack({ order: roles }),
      inset: 4,
    }),
  ],
  scales: {
    x: {
      scale: () => scaleLinear().domain([0, Math.max(...artists.map((row) => row.total))]),
      axis: { label: "Events" },
      grid: true,
    },
    y: {
      scale: () => scaleBand().domain(artists.map((row) => row.artist)),
    },
  },
  color: {
    scale: scaleOrdinal<string, string>()
      .domain(roles)
      .range([
        "var(--gigs-artist-main, var(--button, #0550ae))",
        "var(--gigs-artist-support, var(--info, #6272a4))",
      ]),
  },
  tooltip,
});

const createChartOptions = (pageStyle: Style) => ({
  definition,
  ariaLabel: "Events per artist",
  ariaDescription:
    "All-time appearances, split into main or co-billed and support acts. Artists seen only once or only as support are excluded. Sorted by total appearances.",
  height: 80 + artists.length * 32,
  renderSvg,
  renderTooltipBody: ({ points }: ChartTooltipBodyRenderContext<ArtistRow>) => {
    const row = points[0]?.datum;
    if (!row) return html``;
    return html`
      <div class="artist-tooltip caption">
        <strong>${row.artist}</strong>
        <ul>
          ${gigs.events
            .filter(
              (event) => event.artists.includes(row.artist) || event.support?.includes(row.artist),
            )
            .toSorted((a, b) => a.date.localeCompare(b.date))
            .map(
              (event) => html`
                <li>
                  <div>
                    <time datetime=${event.date}
                      >${dateFormat(new Date(event.date), pageStyle)}</time
                    >
                    · ${event.venue}, ${event.city}
                  </div>
                  ${event.artists.includes(row.artist)
                    ? html`<div>Main / co-billed</div>`
                    : html`<div class="artist-tooltip-support">
                        Supporting ${event.artists.join(", ")}
                      </div>`}
                </li>
              `,
            )}
        </ul>
      </div>
    `;
  },
});

@customElement("gigs-by-artist")
export class GigsByArtist extends LitElement {
  static styles = [unsafeCSS(base), unsafeCSS(styles)];

  @consume({ context: stylePref.context, subscribe: true })
  pageStyle: Style = stylePref.fallback;

  @cache(({ pageStyle }) => [pageStyle])
  get chartOptions() {
    return createChartOptions(this.pageStyle);
  }

  render() {
    return html`
      <h2 class="headline6">Events per artist</h2>
      <p class="caption">
        Artists seen only once or only as support are excluded · Sorted by total appearances
      </p>
      <ul class="legend caption" aria-label="Appearance types">
        <li><span class="swatch main"></span>Main / co-billed</li>
        <li><span class="swatch support"></span>Support</li>
      </ul>
      <div class="chart">
        <tanstack-chart .options=${this.chartOptions}></tanstack-chart>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gigs-by-artist": GigsByArtist;
  }
}
