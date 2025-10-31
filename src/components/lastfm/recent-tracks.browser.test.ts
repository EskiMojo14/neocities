import { html } from "lit";
import { delay, HttpResponse } from "msw";
import { expect } from "vitest";
import { page } from "vitest/browser";
import { mockEndpoint } from "../../data/lastfm.mock.ts";
import { getRecentTracks } from "../../data/lastfm.ts";
import { searchLinks } from "../../data/music.ts";
import { it } from "../../vite/utils.browser.ts";
import "./recent-tracks.ts";

it("should display recent tracks", async ({ worker, setStyle }) => {
  worker.use(
    mockEndpoint(getRecentTracks, async () => {
      await delay();

      return HttpResponse.json({
        recenttracks: {
          track: [
            {
              name: "When The Time Is Right",
              artist: { "#text": "Dirty Loops" },
              album: { "#text": "When The Time Is Right" },
              image: [
                {
                  size: "large",
                  "#text":
                    "https://lastfm.freetls.fastly.net/i/u/174s/14d1fe21a22a2e4eca73353ce613d555.jpg",
                },
              ],
              date: {
                uts: "1751810987",
              },
            },
          ],
        },
      });
    }),
  );

  const screen = page.render(html`<recent-tracks></recent-tracks>`);

  await expect.element(screen.getByText("Recently played")).toBeInTheDocument();

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

  const date = screen.getByRole("time");
  await expect.element(date).toBeInTheDocument();
  await expect.element(date).toHaveTextContent("2025-07-06T14:09:47Z");

  await setStyle("normal");
  await expect.element(date).toHaveTextContent("6 Jul 2025");
});
