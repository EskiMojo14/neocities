export function groupVenueEvents<T extends { venue: string; city: string; date: string }>(
  events: ReadonlyArray<T>,
) {
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
