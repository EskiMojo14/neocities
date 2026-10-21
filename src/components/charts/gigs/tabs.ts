import { html, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";
import { TabGroup } from "../../tabs/tab-group.ts";
import styles from "./tabs.css?type=raw";
import "./heatmap/heatmap.ts";
import "./artist/artist.ts";
import "./venue/venue.ts";
import "./city/city.ts";

@customElement("gigs-tabs")
export class GigsTabs extends TabGroup {
  static styles = [...TabGroup.styles, unsafeCSS(styles)];

  protected label = "Gig charts";
  protected tabs = [
    {
      id: "month",
      label: "Year / month",
      render: () => html`<gigs-year-month-heatmap></gigs-year-month-heatmap>`,
    },
    { id: "artist", label: "Artist", render: () => html`<gigs-by-artist></gigs-by-artist>` },
    { id: "venue", label: "Venue", render: () => html`<gigs-by-venue></gigs-by-venue>` },
    { id: "city", label: "City", render: () => html`<gigs-by-city></gigs-by-city>` },
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    "gigs-tabs": GigsTabs;
  }
}
