import { html } from "lit";
import { delay, HttpResponse } from "msw";
import { expect } from "vitest";
import { page } from "vitest/browser";
import { mockEndpoint } from "../../data/lastfm.mock.ts";
import { getTopTracks } from "../../data/lastfm.ts";
import { searchLinks } from "../../data/music.ts";
import { it } from "../../vite/utils.browser.ts";
import "./top-tracks.ts";

it("should display top tracks", async ({ worker, setStyle }) => {
  worker.use(
    mockEndpoint(getTopTracks, async () => {
      await delay();

      return HttpResponse.json({
        toptracks: {
          track: [
            {
              name: "When The Time Is Right",
              artist: { name: "Dirty Loops" },
              image: [
                {
                  size: "large",
                  "#text":
                    "https://lastfm.freetls.fastly.net/i/u/174s/14d1fe21a22a2e4eca73353ce613d555.jpg",
                },
              ],
              playcount: 10000,
              "@attr": {
                rank: 1,
              },
            },
          ],
        },
      });
    }),
  );

  const screen = page.render(html`<top-tracks></top-tracks>`);
  await expect.element(screen.getByText("Top tracks")).toBeInTheDocument();

  await expect
    .element(screen.getByText("When The Time Is Right"))
    .toBeInTheDocument();
  await expect.element(screen.getByText("Dirty Loops")).toBeInTheDocument();

  for (const link of searchLinks) {
    await expect
      .element(
        screen.getByRole("link", {
          name: `Search ${link.label} for When The Time Is Right by Dirty Loops`,
        }),
      )
      .toBeInTheDocument();
  }

  await expect.element(screen.getByText("10_000 plays")).toBeInTheDocument();
  await setStyle("normal");
  await expect.element(screen.getByText("10,000 plays")).toBeInTheDocument();
});
