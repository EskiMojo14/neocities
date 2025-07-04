import type { Options } from "ky";
import ky from "ky";
import * as v from "valibot";
import * as vUtils from "../utils/valibot.ts";
import { queryOptions } from "./query.ts";

const api = ky.create({
  prefixUrl: "https://ws.audioscrobbler.com/2.0/",
  searchParams: {
    api_key: import.meta.env.LASTFM_API_KEY,
    format: "json",
    user: import.meta.env.LASTFM_USER,
  },
});

async function fetchWithSchema<TSchema extends v.GenericSchema>(
  options: Options,
  schema: TSchema,
) {
  const unparsed = await api("", options).json();
  const { success, output, issues } = v.safeParse(schema, unparsed);
  if (!success) {
    console.error(v.summarize(issues));
    throw new Error("Invalid response from API", {
      cause: new v.ValiError(issues),
    });
  }
  return output;
}

const imageSizeSchema = v.picklist([
  "small",
  "medium",
  "large",
  "extralarge",
  "mega",
]);
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

export const getRecentTracks = (limit: number) =>
  queryOptions({
    queryKey: ["lastfm", "recent-tracks", limit],
    async queryFn({ signal }) {
      const response = await fetchWithSchema(
        {
          searchParams: { method: "user.getRecentTracks", limit },
          signal,
        },
        recentTracksResponseSchema,
      );
      return response.recenttracks.track;
    },
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

export const periodLabels: Record<Period, string> = {
  "7day": "7d",
  "1month": "30d",
  "3month": "3m",
  "6month": "6m",
  "12month": "12m",
  overall: "All",
};

export const fullPeriodLabels: Record<Period, string> = {
  "7day": "Last 7 days",
  "1month": "Last 30 days",
  "3month": "Last 3 months",
  "6month": "Last 6 months",
  "12month": "Last 12 months",
  overall: "All time",
};

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

export const getTopTracks = (period: Period, limit: number) =>
  queryOptions({
    queryKey: ["lastfm", "top-tracks", period, limit],
    async queryFn({ signal }) {
      const response = await fetchWithSchema(
        {
          searchParams: { method: "user.getTopTracks", limit, period },
          signal,
        },
        topTracksResponseSchema,
      );
      return response.toptracks.track;
    },
  });

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

export const getTopArtists = (period: Period, limit: number) =>
  queryOptions({
    queryKey: ["lastfm", "top-artists", period, limit],
    async queryFn({ signal }) {
      const response = await fetchWithSchema(
        {
          searchParams: { method: "user.getTopArtists", limit, period },
          signal,
        },
        topArtistsResponseSchema,
      );
      return response.topartists.artist;
    },
  });

const userDataSchema = v.object({
  playcount: vUtils.coerceNumber,
  artist_count: vUtils.coerceNumber,
  track_count: vUtils.coerceNumber,
  album_count: vUtils.coerceNumber,
});

export type UserData = v.InferOutput<typeof userDataSchema>;

const userResponseSchema = v.object({
  user: userDataSchema,
});

export const getUserData = () =>
  queryOptions({
    queryKey: ["lastfm", "user"],
    async queryFn({ signal }) {
      const response = await fetchWithSchema(
        {
          searchParams: { method: "user.getInfo" },
          signal,
        },
        userResponseSchema,
      );
      return response.user;
    },
  });
