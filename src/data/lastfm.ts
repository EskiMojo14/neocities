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

const imageSchema = v.pipe(
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
);

const baseTrackSchema = v.object({
  name: v.string(),
  image: imageSchema,
});

const commonRecentTrackSchema = v.object({
  ...baseTrackSchema.entries,
  artist: itemSchema,
  album: itemSchema,
});

const recentTrackSchema = v.union([
  v.pipe(
    v.object({
      ...commonRecentTrackSchema.entries,
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
      ...commonRecentTrackSchema.entries,
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

export async function getRecentTracks(
  limit: number,
  { signal }: { signal?: AbortSignal } = {},
): Promise<Array<RecentTrack>> {
  const unparsed = await api
    .get("", {
      searchParams: { method: "user.getRecentTracks", limit },
      signal,
    })
    .json();
  const parsed = v.safeParse(recentTracksResponseSchema, unparsed);
  if (!parsed.success) {
    console.error(v.summarize(parsed.issues));
    throw new Error("Invalid response from API", {
      cause: new v.ValiError(parsed.issues),
    });
  }
  return parsed.output.recenttracks.track;
}

export const periodSchema = v.picklist([
  "7day",
  "1month",
  "3month",
  "6month",
  "12month",
  "overall",
]);
export type Period = v.InferOutput<typeof periodSchema>;

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

export async function getTopTracks(
  period: Period,
  limit: number,
  { signal }: { signal?: AbortSignal } = {},
): Promise<Array<TopTrack>> {
  const unparsed = await api
    .get("", {
      searchParams: { method: "user.getTopTracks", limit, period },
      signal,
    })
    .json();
  const { success, output, issues } = v.safeParse(
    topTracksResponseSchema,
    unparsed,
  );
  if (!success) {
    console.error(v.summarize(issues));
    throw new Error("Invalid response from API", {
      cause: new v.ValiError(issues),
    });
  }
  return output.toptracks.track;
}

const topArtistSchema = v.pipe(
  v.object({
    name: v.string(),
    playcount: vUtils.coerceNumber,
    image: imageSchema,
    "@attr": v.object({
      rank: vUtils.coerceNumber,
    }),
  }),
  v.transform(({ "@attr": { rank }, ...artist }) => ({
    ...artist,
    rank,
  })),
);

export type TopArtist = v.InferOutput<typeof topArtistSchema>;

const topArtistsResponseSchema = v.object({
  topartists: v.object({
    artist: v.array(topArtistSchema),
  }),
});

export async function getTopArtists(
  period: Period,
  limit: number,
  { signal }: { signal?: AbortSignal } = {},
): Promise<Array<TopArtist>> {
  const unparsed = await api
    .get("", {
      searchParams: { method: "user.getTopArtists", limit, period },
      signal,
    })
    .json();
  const { success, output, issues } = v.safeParse(
    topArtistsResponseSchema,
    unparsed,
  );
  if (!success) {
    console.error(v.summarize(issues));
    throw new Error("Invalid response from API", {
      cause: new v.ValiError(issues),
    });
  }
  return output.topartists.artist;
}
