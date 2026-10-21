import { expect, it } from "vite-plus/test";
import { groupCityEvents } from "./city-data.ts";
import gigs from "./gigs.json" with { type: "json" };
import england from "./england.json" with { type: "json" };
import { geoContains } from "d3-geo";

it("uses an England boundary that excludes the other UK countries", () => {
  const outline = { type: "MultiPolygon" as const, coordinates: england.coordinates };
  expect(england.source).toContain("1:50m");
  expect(geoContains(outline, [-0.1276, 51.5072])).toBe(true);
  const otherCapitals: Array<[number, number]> = [
    [-3.1791, 51.4816],
    [-3.1883, 55.9533],
    [-5.9301, 54.5973],
  ];
  for (const capital of otherCapitals) {
    expect(geoContains(outline, capital)).toBe(false);
  }
});

it("counts all events once and retains chronological event lists and geographic coordinates", () => {
  const cities = groupCityEvents(gigs.events);
  expect(cities).toHaveLength(7);
  expect(cities.reduce((sum, row) => sum + row.properties.count, 0)).toBe(gigs.events.length);
  expect(cities[0]?.properties.city).toBe("Bristol");
  for (const { geometry, properties: city } of cities) {
    expect(geometry.coordinates).toHaveLength(2);
    expect(geometry.coordinates.every(Number.isFinite)).toBe(true);
    expect(city.events).toEqual(
      gigs.events
        .filter((event) => event.city === city.city)
        .toSorted((a, b) => a.date.localeCompare(b.date)),
    );
    expect(city.count).toBe(city.events.length);
  }
});

it("handles an empty history", () => {
  expect(groupCityEvents([])).toEqual([]);
});

it("reports cities without coordinates rather than silently omitting them", () => {
  expect(() => groupCityEvents([{ city: "Unknown", date: "2026-01-01" }])).toThrow(
    "Missing map coordinates for gig city: Unknown",
  );
});
