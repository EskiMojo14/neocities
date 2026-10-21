import { expect, it } from "vite-plus/test";
import { groupVenueEvents } from "./venue-data.ts";
import gigs from "./gigs.json" with { type: "json" };

it("groups by venue and city, retaining chronological events and single visits", () => {
  const early = { venue: "Forum", city: "Bath", date: "2020-01-01" };
  const late = { venue: "Forum", city: "Bath", date: "2025-01-01" };
  const namesake = { venue: "Forum", city: "London", date: "2024-01-01" };
  expect(groupVenueEvents([late, namesake, early])).toEqual([
    { venue: "Forum", city: "Bath", label: "Forum, Bath", count: 2, events: [early, late] },
    { venue: "Forum", city: "London", label: "Forum, London", count: 1, events: [namesake] },
  ]);
});

it("handles an empty history", () => {
  expect(groupVenueEvents([])).toEqual([]);
});

it("counts every recorded event exactly once", () => {
  const venues = groupVenueEvents(gigs.events);
  expect(venues.reduce((sum, row) => sum + row.count, 0)).toBe(gigs.events.length);
  expect(
    venues.flatMap((row) => row.events).toSorted((a, b) => a.date.localeCompare(b.date)),
  ).toEqual(gigs.events.toSorted((a, b) => a.date.localeCompare(b.date)));
  for (const row of venues) {
    expect(row.count).toBe(row.events.length);
    expect(row.events.every((event) => event.venue === row.venue && event.city === row.city)).toBe(
      true,
    );
  }
  expect(venues.map((row) => row.count)).toEqual(
    venues.map((row) => row.count).toSorted((a, b) => b - a),
  );
});
