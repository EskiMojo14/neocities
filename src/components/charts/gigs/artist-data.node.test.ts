import { expect, it } from "vite-plus/test";
import { countArtistEvents } from "./artist-data.ts";
import gigs from "./gigs.json" with { type: "json" };

it("counts main and support appearances across the full history, excluding support-only artists", () => {
  expect(
    countArtistEvents([
      { artists: ["B", "C", "Seen once"], support: ["A", "Support only"] },
      { artists: ["A"], support: ["B"] },
      { artists: ["A", "A"], support: ["A", "C", "C"] },
    ]),
  ).toEqual([
    { artist: "A", main: 2, support: 1, total: 3 },
    { artist: "B", main: 1, support: 1, total: 2 },
    { artist: "C", main: 1, support: 1, total: 2 },
  ]);
});

it("handles an empty history", () => {
  expect(countArtistEvents([])).toEqual([]);
});

it("matches every artist's main and support counts in the gig history", () => {
  const counts = countArtistEvents(gigs.events);
  expect(new Set(counts.map((row) => row.artist))).toEqual(
    new Set(
      gigs.events
        .flatMap((event) => event.artists)
        .filter(
          (artist) =>
            gigs.events.filter(
              (event) => event.artists.includes(artist) || event.support?.includes(artist),
            ).length > 1,
        ),
    ),
  );
  for (const row of counts) {
    expect(row.main).toBe(gigs.events.filter((event) => event.artists.includes(row.artist)).length);
    expect(row.support).toBe(
      gigs.events.filter(
        (event) => event.support?.includes(row.artist) && !event.artists.includes(row.artist),
      ).length,
    );
    expect(row.total).toBe(row.main + row.support);
    expect(row.total).toBeGreaterThan(1);
  }
});
