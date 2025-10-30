import { html } from "lit";
import { delay, HttpResponse } from "msw";
import { expect } from "vitest";
import { page } from "vitest/browser";
import { mockEndpoint } from "../../data/lastfm.mock.ts";
import { getUserData } from "../../data/lastfm.ts";
import { it } from "../../vite/utils.browser.ts";
import "./scrobble-data.ts";

it("should render placeholder data while loading, then real data", async ({
  worker,
  setStyle,
}) => {
  worker.use(
    mockEndpoint(getUserData, async () => {
      await delay();

      return HttpResponse.json({
        user: {
          playcount: 10000,
          artist_count: 10000,
          track_count: 10000,
          album_count: 10000,
        },
      });
    }),
  );

  const screen = page.render(html`<scrobble-data></scrobble-data>`);
  await expect.element(screen.getByText("0,000 artists")).toBeInTheDocument();

  await expect.element(screen.getByText("10_000 artists")).toBeInTheDocument();

  await setStyle("normal");
  await expect.element(screen.getByText("10,000 artists")).toBeInTheDocument();
});
