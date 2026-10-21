import type { GigEvent } from "../gigs.types.ts";

type ArtistEvent = Pick<GigEvent, "artists" | "support">;
type ArtistCounts = { artist: string; main: number; support: number };
export type ArtistSummary = ArtistCounts & { total: number };
export type ArtistRole = "Main / co-billed" | "Support";
export type ArtistRow = ArtistSummary & { role: ArtistRole; count: number };

export function countArtistEvents(events: ReadonlyArray<ArtistEvent>): Array<ArtistSummary> {
  const counts = new Map<string, ArtistCounts>();

  for (const event of events) {
    for (const artist of new Set(event.artists)) {
      const row = counts.get(artist) ?? { artist, main: 0, support: 0 };
      row.main += 1;
      counts.set(artist, row);
    }
  }

  for (const event of events) {
    for (const artist of new Set(event.support)) {
      const row = counts.get(artist);
      if (row && !event.artists.includes(artist)) row.support += 1;
    }
  }

  return [...counts.values()]
    .map((row) => ({ ...row, total: row.main + row.support }))
    .filter((row) => row.total > 1)
    .sort((a, b) => b.total - a.total || a.artist.localeCompare(b.artist));
}
