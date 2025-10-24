export const searchLinks: Array<{
  icon: string;
  label: string;
  getLink: (query: string) => string;
}> = [
  {
    icon: "music_cast",
    label: "Spotify",
    getLink: (query) =>
      `https://open.spotify.com/search/${encodeURIComponent(query)}`,
  },
  {
    icon: "smart_display",
    label: "YouTube",
    getLink: (query) =>
      `https://www.youtube.com/results?search_query=${encodeURIComponent(
        query,
      )}`,
  },
];
