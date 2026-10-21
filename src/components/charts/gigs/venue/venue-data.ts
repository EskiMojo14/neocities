import type { GigEvent } from "../gigs.types.ts";

type VenueEvent = Pick<GigEvent, "venue" | "city" | "date">;
export type VenueRow<T extends VenueEvent = GigEvent> = {
  venue: string;
  city: string;
  label: string;
  count: number;
  events: Array<T>;
};

export function groupVenueEvents<T extends VenueEvent>(
  events: ReadonlyArray<T>,
): Array<VenueRow<T>> {
  return [...Map.groupBy(events, (event) => JSON.stringify([event.venue, event.city])).values()]
    .map((events) => ({
      venue: events[0]!.venue,
      city: events[0]!.city,
      label: `${events[0]!.venue}, ${events[0]!.city}`,
      count: events.length,
      events: events.toSorted((a, b) => a.date.localeCompare(b.date)),
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}
