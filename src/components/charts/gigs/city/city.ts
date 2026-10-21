import { defineChart } from "@tanstack/charts";
import { geoShape } from "@tanstack/charts/geo";
import type { GeoProjectionContext } from "@tanstack/charts/geo";
import { decorative } from "@tanstack/charts/mark/decorative";
import { tooltip } from "@tanstack/charts/tooltip";
import type { ChartSvgRenderer } from "@tanstack/charts";
import type { ChartTooltipBodyRenderContext } from "@tanstack/charts/lit";
import { geoMercator } from "d3-geo";
import { consume } from "@lit/context";
import { html, LitElement, nothing, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";
import { stylePref, type Style } from "../../../../constants/prefs.ts";
import { dateFormat } from "../../../../utils/index.ts";
import { cache } from "../../../../utils/lit.ts";
import base from "../../../../styles/utility/baseline.css?type=raw";
import styles from "./city.css?type=raw";
import { groupCityEvents, type CityRow } from "./city-data.ts";
import { renderSvg } from "../svg.ts";
import gigs from "../gigs.json" with { type: "json" };
import england from "./england.json" with { type: "json" };
import "../../register.ts";

const cities: Array<CityRow> = groupCityEvents(gigs.events);
const outline = {
  type: "MultiPolygon" as const,
  coordinates: england.coordinates,
};
const frame = {
  type: "MultiPoint" as const,
  coordinates: cities.map((row) => row.geometry.coordinates),
};

const createMap = () => {
  const projection = ({ chart: { x, y, width, height } }: GeoProjectionContext<unknown>) =>
    geoMercator()
      .fitExtent(
        [
          [x + 64, y + 40],
          [x + width - 64, y + height - 40],
        ],
        frame,
      )
      .clipExtent([
        [x, y],
        [x + width, y + height],
      ]);
  const definition = defineChart({
    margin: 0,
    scales: { x: null, y: null },
    marks: [
      decorative(
        geoShape([outline], {
          id: "england-outline",
          projection,
          fill: "var(--gigs-land-color, light-dark(var(--green0, #dafbe1), var(--green-30, #25452d)))",
          stroke: "var(--divider)",
          strokeWidth: 1,
        }),
      ),
      geoShape(cities, {
        id: "gigs-by-city",
        projection,
        key: (row) => row.properties.city,
        r: (row) => Math.sqrt(row.properties.count) * 3,
        fill: "var(--gigs-city-color, var(--button, #0550ae))",
        fillOpacity: 0.7,
        stroke: "var(--page-foreground)",
        strokeWidth: 1,
      }),
    ],
    tooltip,
  });
  const renderMap: ChartSvgRenderer = (scene, options) => {
    const project = projection({ chart: scene.chart, data: [] });
    return renderSvg(
      {
        ...scene,
        nodes: [
          ...scene.nodes,
          ...cities.map((row) => {
            const point = project(row.geometry.coordinates);
            if (!point) throw new Error(`Could not project ${row.properties.city}`);
            const below =
              row.properties.city === "Trowbridge" ||
              row.properties.city === "Brighton" ||
              row.properties.city === "Bath";
            const left = row.properties.city === "Bristol" || row.properties.city === "Bath";
            const right =
              row.properties.city === "Bradford-on-Avon" || row.properties.city === "Trowbridge";
            return {
              kind: "label" as const,
              key: `city-label:${row.properties.city}`,
              x: point[0] + (left ? -16 : right ? 10 : 0),
              y: point[1] + (below ? 20 : -20),
              text: row.properties.city,
              anchor: left ? ("end" as const) : right ? ("start" as const) : ("middle" as const),
              style: { fill: "var(--page-foreground)" },
            };
          }),
        ],
      },
      options,
    );
  };
  return { definition, renderSvg: renderMap };
};

const mainMap = createMap();

const renderEvents =
  (pageStyle: Style) =>
  ({ points }: ChartTooltipBodyRenderContext<CityRow>) => {
    const city = points[0]?.datum.properties;
    if (!city) return nothing;
    return html`
      <div class="city-tooltip caption">
        <strong>${city.city} · ${city.count} event${city.count !== 1 ? "s" : ""}</strong>
        <ul>
          ${city.events.map(
            (event) => html`
              <li>
                <strong>${event.artists.join(", ")}</strong>
                ${event.support?.length
                  ? html`<div class="city-tooltip-support">
                      Support: ${event.support.join(", ")}
                    </div>`
                  : null}
                <div>
                  <time datetime=${event.date}>${dateFormat(new Date(event.date), pageStyle)}</time>
                  · ${event.venue}
                </div>
              </li>
            `,
          )}
        </ul>
      </div>
    `;
  };

@customElement("gigs-by-city")
export class GigsByCity extends LitElement {
  static styles = [unsafeCSS(base), unsafeCSS(styles)];

  @consume({ context: stylePref.context, subscribe: true })
  pageStyle: Style = stylePref.fallback;

  @cache(({ pageStyle }) => [pageStyle])
  get chartOptions() {
    const renderTooltipBody = renderEvents(this.pageStyle);
    return {
      ...mainMap,
      height: 640,
      ariaLabel: "Events per city on an England map",
      renderTooltipBody,
    };
  }

  render() {
    return html`
      <h2 class="headline6">Events per city</h2>
      <p class="caption">Circle area represents event count</p>
      <tanstack-chart .options=${this.chartOptions}></tanstack-chart>
      <ul class="sr-only" aria-label="Events per city">
        ${cities.map(({ properties: city }) => html`<li>${city.city}: ${city.count}</li>`)}
      </ul>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "gigs-by-city": GigsByCity;
  }
}
