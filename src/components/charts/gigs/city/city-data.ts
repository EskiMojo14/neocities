import type { GigEvent } from "../gigs.types.ts";

type CityEvent = Pick<GigEvent, "city" | "date">;
export type CityRow<T extends CityEvent = GigEvent> = {
  type: "Feature";
  geometry: { type: "Point"; coordinates: [number, number] };
  properties: {
    city: string;
    count: number;
    events: Array<T>;
  };
};

const coordinates: Readonly<Record<string, [number, number]>> = {
  London: [-0.1276, 51.5072],
  Birmingham: [-1.9025, 52.4862],
  "Bradford-on-Avon": [-2.2506, 51.3475],
  Bristol: [-2.5879, 51.4545],
  Bath: [-2.359, 51.3811],
  Brighton: [-0.1372, 50.8225],
  Trowbridge: [-2.2086, 51.3193],
};

export function groupCityEvents<T extends CityEvent>(events: ReadonlyArray<T>): Array<CityRow<T>> {
  return [...Map.groupBy(events, (event) => event.city)]
    .map(([city, events]) => {
      const location = Object.hasOwn(coordinates, city) ? coordinates[city] : undefined;
      if (!location) {
        throw new Error(`Missing map coordinates for gig city: ${city}`);
      }
      return {
        type: "Feature" as const,
        geometry: { type: "Point" as const, coordinates: location },
        properties: {
          city,
          count: events.length,
          events: events.toSorted((a, b) => a.date.localeCompare(b.date)),
        },
      };
    })
    .sort(
      (a, b) =>
        b.properties.count - a.properties.count ||
        a.properties.city.localeCompare(b.properties.city),
    );
}
