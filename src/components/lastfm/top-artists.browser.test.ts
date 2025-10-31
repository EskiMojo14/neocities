import { html } from "lit";
import { delay, HttpResponse } from "msw";
import { expect } from "vitest";
import { page } from "vitest/browser";
import { mockEndpoint } from "../../data/lastfm.mock.ts";
import { getTopArtists } from "../../data/lastfm.ts";
import { searchLinks } from "../../data/music.ts";
import { it } from "../../vite/utils.browser.ts";
import "./top-artists.ts";

it("should display top artists", async ({ worker, setStyle }) => {
  worker.use(
    mockEndpoint(getTopArtists, async () => {
      await delay();

      return HttpResponse.json({
        topartists: {
          artist: [
            {
              name: "Dirty Loops",
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

  const screen = page.render(html`<top-artists></top-artists>`);
  await expect.element(screen.getByText("Top artists")).toBeInTheDocument();

  await expect.element(screen.getByText("Dirty Loops")).toBeInTheDocument();

  for (const link of searchLinks) {
    await expect
      .element(
        screen.getByRole("link", {
          name: `Search ${link.label} for Dirty Loops`,
        }),
      )
      .toBeInTheDocument();
  }

  await expect.element(screen.getByText("10_000 plays")).toBeInTheDocument();
  await setStyle("normal");
  await expect.element(screen.getByText("10,000 plays")).toBeInTheDocument();
});
