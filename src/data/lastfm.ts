import ky from "ky";
import * as v from "valibot";
import * as vUtils from "../utils/valibot.ts";

const api = ky.create({
  prefixUrl: "https://ws.audioscrobbler.com/2.0/",
  searchParams: {
    api_key: import.meta.env.LASTFM_API_KEY,
    format: "json",
    user: import.meta.env.LASTFM_USERNAME,
  },
});

const imageSizeSchema = v.picklist(["small", "medium", "large", "extralarge"]);
type ImageSize = v.InferOutput<typeof imageSizeSchema>;

const itemSchema = v.pipe(
  v.object({
    "#text": v.string(),
  }),
  v.transform((item) => item["#text"]),
);

const baseTrackSchema = v.object({
  name: v.string(),
  album: v.optional(itemSchema),
  image: v.pipe(
    v.array(
      v.object({
        size: imageSizeSchema,
        "#text": v.string(),
      }),
    ),
    v.transform((images) =>
      images.reduce<Partial<Record<ImageSize, string>>>((acc, image) => {
        acc[image.size] = image["#text"];
        return acc;
      }, {}),
    ),
  ),
});

const recentTrackSchema = v.union([
  v.pipe(
    v.object({
      ...baseTrackSchema.entries,
      artist: itemSchema,
      date: v.pipe(
        v.object({
          // seconds since unix epoch
          uts: v.string(),
        }),
        v.transform(({ uts }) => new Date(Number(uts) * 1000).toISOString()),
      ),
    }),
    v.transform((track) => ({
      ...track,
      nowPlaying: false as const,
    })),
  ),
  v.pipe(
    v.object({
      ...baseTrackSchema.entries,
      artist: itemSchema,
      date: v.optional(v.never()),
      "@attr": v.object({
        nowplaying: v.literal("true"),
      }),
    }),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    v.transform(({ "@attr": _attr, ...rest }) => ({
      ...rest,
      nowPlaying: true as const,
    })),
  ),
]);

export type RecentTrack = v.InferOutput<typeof recentTrackSchema>;

const recentTracksResponseSchema = v.object({
  recenttracks: v.object({
    track: v.array(recentTrackSchema),
  }),
});

export async function get5RecentTracks(): Promise<Array<RecentTrack>> {
  const unparsed = await api
    .get("", {
      searchParams: { method: "user.getRecentTracks", limit: 5 },
    })
    .json();
  const parsed = v.safeParse(recentTracksResponseSchema, unparsed);
  if (!parsed.success) {
    console.error(v.summarize(parsed.issues));
    return [];
  }
  return parsed.output.recenttracks.track;
}

const topTrackSchema = v.pipe(
  v.object({
    ...baseTrackSchema.entries,
    artist: v.pipe(
      v.object({ name: v.string() }),
      v.transform(({ name }) => name),
    ),
    playcount: vUtils.coerceNumber,
    "@attr": v.object({
      rank: vUtils.coerceNumber,
    }),
  }),
  v.transform(({ "@attr": { rank }, ...track }) => ({
    ...track,
    rank,
  })),
);

export type TopTrack = v.InferOutput<typeof topTrackSchema>;

const topTracksResponseSchema = v.object({
  toptracks: v.object({
    track: v.array(topTrackSchema),
  }),
});

export const periodSchema = v.picklist([
  "7day",
  "1month",
  "3month",
  "6month",
  "12month",
  "overall",
]);
export type Period = v.InferOutput<typeof periodSchema>;

export async function getTop5Tracks(
  period: Period = "overall",
): Promise<Array<TopTrack>> {
  const unparsed = await api
    .get("", {
      searchParams: { method: "user.getTopTracks", limit: 5, period },
    })
    .json();
  const parsed = v.safeParse(topTracksResponseSchema, unparsed);
  if (!parsed.success) {
    console.error(v.summarize(parsed.issues));
    return [];
  }
  return parsed.output.toptracks.track;
}
