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
      if (event.artists.includes(artist)) continue;
      const row = counts.get(artist) ?? { artist, main: 0, support: 0 };
      row.support += 1;
      counts.set(artist, row);
    }
  }

  return [...counts.values()]
    .map((row) => ({ ...row, total: row.main + row.support }))
    .sort(
      (a, b) =>
        Number(a.main === 0) - Number(b.main === 0) ||
        b.total - a.total ||
        a.artist.localeCompare(b.artist),
    );
}
