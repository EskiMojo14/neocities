import { cell, defineChart, text } from "@tanstack/charts";
import { decorative } from "@tanstack/charts/mark/decorative";
import { scaleBand } from "@tanstack/charts/scales/band";
import { scaleOrdinal } from "@tanstack/charts/scales/ordinal";
import { tooltip } from "@tanstack/charts/tooltip";
import type { ChartSvgRenderer, SceneNode } from "@tanstack/charts";
import { renderChartSvg } from "@tanstack/charts/svg";
import type { ChartTooltipBodyRenderContext } from "@tanstack/charts/lit";
import { html, LitElement, nothing, unsafeCSS } from "lit";
import { consume } from "@lit/context";
import { customElement } from "lit/decorators.js";
import { stylePref, type Style } from "../../../../constants/prefs.ts";
import { dateFormat } from "../../../../utils/index.ts";
import { cache } from "../../../../utils/lit.ts";
import base from "../../../../styles/utility/baseline.css?type=raw";
import heatmap from "./heatmap.css?type=raw";
import gigs from "../gigs.json" with { type: "json" };
import type { GigEvent } from "../gigs.types.ts";
import { addTypography } from "../svg.ts";
import "../../register.ts";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

const colorLevelCount = 8;
const minOpacity = 0.06;
const maxOpacity = 0.9;

const colorOpacities = Array.from(
  { length: colorLevelCount },
  (_, level) => minOpacity + (maxOpacity - minOpacity) * (level / (colorLevelCount - 1)),
);
const colorLevels = colorOpacities.map((_, index) => String(index));
const heatmapColor = (level: number) => {
  const opacity = colorOpacities[level] ?? colorOpacities[0] ?? 0;
  return `rgba(from var(--gigs-heatmap-color, var(--button, #0550ae)) r g b / ${opacity})`;
};
const heatmapBackground = (level: number) => {
  const opacity = colorOpacities[level] ?? colorOpacities[0] ?? 0;
  return `color-mix(in srgb, var(--gigs-heatmap-color, var(--button, #0550ae)) ${opacity * 100}%, var(--page-background, #fff))`;
};
const heatmapColors = colorOpacities.map((_, index) => heatmapColor(index));

const lastYear = Math.max(...gigs.events.map(({ date }) => Number(date.slice(0, 4))));
const firstYear = Math.min(...gigs.events.map(({ date }) => Number(date.slice(0, 4))));
const years = Array.from({ length: lastYear - firstYear + 1 }, (_, index) =>
  String(firstYear + index),
);

const gigsByMonth = Map.groupBy(gigs.events, (event) => event.date.slice(0, 7));

type HeatmapRow = {
  year: string;
  month: string;
  events: Array<GigEvent>;
  period: string;
  level: string;
};

const heatmapRows: Array<HeatmapRow> = years.flatMap((year) =>
  months.map((month, index) => {
    const period = `${year}-${String(index + 1).padStart(2, "0")}`;
    const events = gigsByMonth.get(period) ?? [];
    return {
      year,
      month,
      events,
      period,
      level: String(Math.min(events.length, colorOpacities.length - 1)),
    };
  }),
);

const styleHeatmapNode = (node: SceneNode, cornerSize: number, countLabel = false): SceneNode => {
  if (node.kind === "group") {
    const isCountLabel = countLabel || node.key === "gigs-by-year-month-counts";
    return {
      ...node,
      children: node.children.map((child) => styleHeatmapNode(child, cornerSize, isCountLabel)),
    };
  }

  if (node.kind === "label") {
    return addTypography(node, countLabel ? "body2" : "caption");
  }

  if (node.kind === "rect" && countLabel) return node;

  if (node.kind === "rect" && node.key.startsWith("gigs-by-year-month:")) {
    const { x, y, width, height } = node;
    const cut = Math.min(cornerSize, width / 2, height / 2);
    const points: Array<readonly [number, number]> = [
      [x + cut, y],
      [x + width - cut, y],
      [x + width, y + cut],
      [x + width, y + height - cut],
      [x + width - cut, y + height],
      [x + cut, y + height],
      [x, y + height - cut],
      [x, y + cut],
      [x + cut, y],
    ];

    return {
      kind: "polyline",
      key: node.key,
      renderer: node.renderer,
      className: node.className,
      style: node.style,
      ariaHidden: node.ariaHidden,
      pointOwner: node.pointOwner,
      pointOwners: node.pointOwners,
      interaction: node.interaction,
      points,
    };
  }

  return node;
};

const createDefinition = (pageStyle: Style) =>
  defineChart({
    marks: [
      cell(heatmapRows, {
        id: "gigs-by-year-month",
        x: "month",
        y: "year",
        color: "level",
        key: "period",
        inset: 4,
        stroke: "var(--gigs-heatmap-border, var(--divider, #dce3ec))",
        strokeWidth: 1,
      }),
      decorative(
        text(heatmapRows, {
          id: "gigs-by-year-month-counts",
          x: "month",
          y: "year",
          text: (row) => row.events.length,
          fill: (row) => `contrast-color(${heatmapBackground(Number(row.level))})`,
          key: "period",
          states: [
            {
              when: ({ datum, focus }) => datum.period === focus.primary.datum.period,
              style: { opacity: 0 },
            },
          ],
        }),
      ),
    ],
    scales: {
      x: {
        scale: () => scaleBand().domain(months),
        axis: {
          label: "Month",
          ticks: {
            format: (month: string) =>
              pageStyle === "code"
                ? String(months.findIndex((label) => label === month) + 1).padStart(2, "0")
                : month,
          },
        },
      },
      y: {
        scale: () => scaleBand().domain(years),
        axis: { label: "Year" },
      },
    },
    color: {
      scale: scaleOrdinal<string, string>().domain(colorLevels).range(heatmapColors),
    },
    tooltip,
  });

const monthFormatter = new Intl.DateTimeFormat(undefined, {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const createChartOptions = (pageStyle: Style) => ({
  definition: createDefinition(pageStyle),
  ariaLabel: "Gigs by year and month",
  ariaDescription:
    "Each cell shows the number of gigs in that month. Darker indicates more gigs. Months run from January (01) to December (12): January, February, March, April, May, June, July, August, September, October, November, December.",
  height: 40 + years.length * 36,
  renderTooltipBody: ({ points }: ChartTooltipBodyRenderContext<HeatmapRow>) => {
    const row = points[0]?.datum;
    if (!row) return nothing;

    return html`
      <div class="gigs-tooltip caption">
        <strong>
          <time datetime=${row.period}>
            ${pageStyle === "code"
              ? row.period
              : monthFormatter.format(new Date(`${row.period}-01T00:00:00Z`))}
          </time>
          · ${row.events.length} gig${row.events.length !== 1 ? "s" : ""}
        </strong>
        ${row.events.length
          ? html`
              <ul>
                ${row.events.map((event) => {
                  return html`
                    <li>
                      <strong>${event.artists.join(", ")}</strong>
                      ${event.support?.length
                        ? html`<div class="gigs-tooltip-support">
                            Support: ${event.support.join(", ")}
                          </div>`
                        : null}
                      <div>
                        <time datetime=${event.date}
                          >${dateFormat(new Date(event.date), pageStyle)}</time
                        >
                        · ${event.venue}, ${event.city}
                      </div>
                    </li>
                  `;
                })}
              </ul>
            `
          : html`<p>No gigs this month</p>`}
      </div>
    `;
  },
});

@customElement("gigs-year-month-heatmap")
export class GigsYearMonthHeatmap extends LitElement {
  static styles = [unsafeCSS(base), unsafeCSS(heatmap)];

  @consume({ context: stylePref.context, subscribe: true })
  pageStyle: Style = stylePref.fallback;

  #renderSvg: ChartSvgRenderer = (scene, options) => {
    const shape = getComputedStyle(this).getPropertyValue("--shape-small").trim();
    const cornerSize = /^\d+(?:\.\d+)?px$/.test(shape) ? Number.parseFloat(shape) : 4;
    return renderChartSvg(
      {
        ...scene,
        nodes: scene.nodes.map((node) => styleHeatmapNode(node, cornerSize)),
      },
      options,
    );
  };

  @cache(({ pageStyle }) => [pageStyle])
  get chartOptions() {
    return {
      ...createChartOptions(this.pageStyle),
      renderSvg: this.#renderSvg,
    };
  }

  render() {
    return html`
      <h2 class="headline6">Gigs by year and month</h2>
      <p class="caption">${gigs.events.length} total events · Darker indicates more events</p>
      <tanstack-chart .options=${this.chartOptions}></tanstack-chart>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gigs-year-month-heatmap": GigsYearMonthHeatmap;
  }
}
