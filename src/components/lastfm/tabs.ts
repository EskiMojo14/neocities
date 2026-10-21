import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { TabGroup } from "../tabs/tab-group.ts";
import "./top-tracks.ts";
import "./top-artists.ts";
import "./recent-tracks.ts";

@customElement("lastfm-tabs")
export class LastfmTabs extends TabGroup {
  protected label = "Last.fm listening";
  protected tabs = [
    {
      id: "tracks",
      label: "Tracks",
      render: () => html`<top-tracks></top-tracks>`,
    },
    {
      id: "artists",
      label: "Artists",
      render: () => html`<top-artists></top-artists>`,
    },
    {
      id: "recent",
      label: "Recents",
      render: () => html`<recent-tracks></recent-tracks>`,
    },
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    "lastfm-tabs": LastfmTabs;
  }
}
