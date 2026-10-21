import { barX, defineChart } from "@tanstack/charts";
import { scaleBand } from "@tanstack/charts/scales/band";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { tooltip } from "@tanstack/charts/tooltip";
import type { ChartSvgRenderer, SceneNode } from "@tanstack/charts";
import type { ChartTooltipBodyRenderContext } from "@tanstack/charts/lit";
import { consume } from "@lit/context";
import { html, LitElement, nothing, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";
import { stylePref, type Style } from "../../../../constants/prefs.ts";
import { dateFormat } from "../../../../utils/index.ts";
import { cache } from "../../../../utils/lit.ts";
import base from "../../../../styles/utility/baseline.css?type=raw";
import styles from "./venue.css?type=raw";
import { groupVenueEvents, type VenueRow } from "./venue-data.ts";
import { renderSvg } from "../svg.ts";
import gigs from "../gigs.json" with { type: "json" };
import "../../register.ts";

const venues: Array<VenueRow> = groupVenueEvents(gigs.events).filter((venue) => venue.count > 1);

const venuesByLabel = new Map(venues.map((row) => [row.label, row]));

const stackVenueLabel = (node: SceneNode): SceneNode => {
  if (node.kind === "group") {
    return { ...node, children: node.children.map(stackVenueLabel) };
  }
  if (node.kind !== "label") return node;
  const venue = venuesByLabel.get(node.text);
  if (!venue) return node;
  return {
    kind: "group",
    key: `${node.key}:stacked`,
    children: [
      { ...node, text: venue.venue, y: node.y - 8 },
      {
        ...node,
        key: `${node.key}:city`,
        text: venue.city,
        y: node.y + 8,
        style: { ...node.style, fill: "var(--comment)" },
      },
    ],
  };
};

const renderVenueSvg: ChartSvgRenderer = (scene, options) =>
  renderSvg({ ...scene, nodes: scene.nodes.map(stackVenueLabel) }, options);

const definition = defineChart({
  margin: { left: 340 },
  marks: [
    barX(venues, {
      id: "gigs-by-venue",
      x: "count",
      y: "label",
      key: "label",
      fill: "var(--gigs-venue-color, var(--button, #0550ae))",
      inset: 4,
    }),
  ],
  scales: {
    x: {
      scale: () => scaleLinear().domain([0, Math.max(...venues.map((row) => row.count))]),
      axis: { label: "Events" },
      grid: true,
    },
    y: {
      scale: () => scaleBand().domain(venues.map((row) => row.label)),
    },
  },
  tooltip,
});

const createChartOptions = (pageStyle: Style) => ({
  definition,
  ariaLabel: "Gigs per venue",
  ariaDescription: "Full gig history grouped by venue and city, sorted by event count.",
  height: 80 + venues.length * 48,
  renderSvg: renderVenueSvg,
  renderTooltipBody: ({ points }: ChartTooltipBodyRenderContext<VenueRow>) => {
    const row = points[0]?.datum;
    if (!row) return nothing;
    return html`
      <div class="venue-tooltip caption">
        <strong>${row.label} · ${row.count} event${row.count !== 1 ? "s" : ""}</strong>
        <ul>
          ${row.events.map(
            (event) => html`
              <li>
                <strong>${event.artists.join(", ")}</strong>
                ${event.support?.length
                  ? html`<div class="venue-tooltip-support">
                      Support: ${event.support.join(", ")}
                    </div>`
                  : null}
                <div>
                  <time datetime=${event.date}>${dateFormat(new Date(event.date), pageStyle)}</time>
                </div>
              </li>
            `,
          )}
        </ul>
      </div>
    `;
  },
});

@customElement("gigs-by-venue")
export class GigsByVenue extends LitElement {
  static styles = [unsafeCSS(base), unsafeCSS(styles)];

  @consume({ context: stylePref.context, subscribe: true })
  pageStyle: Style = stylePref.fallback;

  @cache(({ pageStyle }) => [pageStyle])
  get chartOptions() {
    return createChartOptions(this.pageStyle);
  }

  render() {
    return html`
      <h2 class="headline6">Gigs per venue</h2>
      <p class="caption">Venues visited only once are excluded · Sorted by event count</p>
      <div class="chart">
        <tanstack-chart .options=${this.chartOptions}></tanstack-chart>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gigs-by-venue": GigsByVenue;
  }
}
