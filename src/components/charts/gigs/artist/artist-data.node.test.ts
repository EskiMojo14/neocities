import { expect, it } from "vite-plus/test";
import { countArtistEvents } from "./artist-data.ts";
import gigs from "../gigs.json" with { type: "json" };

it("counts all main and support appearances, including single appearances and support-only artists", () => {
  expect(
    countArtistEvents([
      { artists: ["B", "C", "Seen once"], support: ["A", "Support only", "Support only"] },
      { artists: ["A"], support: ["B"] },
      { artists: ["A", "A"], support: ["A", "C", "C"] },
    ]),
  ).toEqual([
    { artist: "A", main: 2, support: 1, total: 3 },
    { artist: "B", main: 1, support: 1, total: 2 },
    { artist: "C", main: 1, support: 1, total: 2 },
    { artist: "Seen once", main: 1, support: 0, total: 1 },
    { artist: "Support only", main: 0, support: 1, total: 1 },
  ]);
});

it("sorts support-only artists last, then by total appearances and name within each group", () => {
  expect(
    countArtistEvents([
      { artists: ["Main once"], support: ["Support B", "Support A"] },
      { artists: ["Mixed"], support: ["Support B", "Support A"] },
      { artists: ["Main twice"], support: ["Mixed", "Support once"] },
      { artists: ["Main twice"], support: [] },
    ]),
  ).toEqual([
    { artist: "Main twice", main: 2, support: 0, total: 2 },
    { artist: "Mixed", main: 1, support: 1, total: 2 },
    { artist: "Main once", main: 1, support: 0, total: 1 },
    { artist: "Support A", main: 0, support: 2, total: 2 },
    { artist: "Support B", main: 0, support: 2, total: 2 },
    { artist: "Support once", main: 0, support: 1, total: 1 },
  ]);
});

it("handles an empty history", () => {
  expect(countArtistEvents([])).toEqual([]);
});

it("matches every artist's main and support counts in the gig history", () => {
  const counts = countArtistEvents(gigs.events);
  expect(new Set(counts.map((row) => row.artist))).toEqual(
    new Set(gigs.events.flatMap((event) => [...event.artists, ...(event.support ?? [])])),
  );
  for (const row of counts) {
    expect(row.main).toBe(gigs.events.filter((event) => event.artists.includes(row.artist)).length);
    expect(row.support).toBe(
      gigs.events.filter(
        (event) => event.support?.includes(row.artist) && !event.artists.includes(row.artist),
      ).length,
    );
    expect(row.total).toBe(row.main + row.support);
    expect(row.total).toBeGreaterThan(0);
  }
});
