export interface ArtistEvent {
  artists: ReadonlyArray<string>;
  support?: ReadonlyArray<string>;
}

export function countArtistEvents(events: ReadonlyArray<ArtistEvent>) {
  const counts = new Map<string, { artist: string; main: number; support: number }>();

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
