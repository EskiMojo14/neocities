import type { QueryKey } from "@tanstack/query-core";
import type { Options, SearchParamsOption } from "ky";
import ky from "ky";
import type { HttpCustomPredicate, PathParams } from "msw";
import * as v from "valibot";
import env from "../constants/env.ts";
import {
  type HasRequiredProps,
  unsafeFromEntries,
  unsafeKeys,
} from "../utils/index.ts";
import * as vUtils from "../utils/valibot.ts";
import { queryOptions } from "./query.ts";

const api = ky.create({
  searchParams: {
    api_key: env.LASTFM_API_KEY,
    format: "json",
    user: env.LASTFM_USER,
  },
});

async function fetchWithSchema<TSchema extends v.GenericSchema>(
  options: Options,
  schema: TSchema,
) {
  const unparsed = await api(
    "http://ws.audioscrobbler.com/2.0/",
    options,
  ).json();
  const { success, output, issues } = v.safeParse(schema, unparsed);
  if (!success) {
    console.error(v.summarize(issues));
    throw new Error("Invalid response from API", {
      cause: new v.ValiError(issues),
    });
  }
  return output;
}

type MswParams<TParams extends PropertyKey, TMultiParams extends TParams> = {
  [K in TParams]: K extends TMultiParams ? ReadonlyArray<string> : string;
};

const makeParamsParser =
  <TParams extends PropertyKey, TMultiParams extends TParams>(
    params: ReadonlyArray<TParams>,
    multiParams: ReadonlyArray<TMultiParams>,
  ) =>
  (searchParams: URLSearchParams) =>
    unsafeFromEntries(
      params.map((key) => [
        key,
        multiParams.includes(key as TMultiParams)
          ? searchParams.getAll(key as string)
          : (searchParams.get(key as string) ?? undefined),
      ]),
    ) as MswParams<TParams, TMultiParams>;

const buildEndpoint = <
  TResponseSchema extends v.GenericSchema,
  const TQueryKey extends QueryKey,
  Selected = v.InferOutput<TResponseSchema>,
  TParams extends Extract<SearchParamsOption, Record<string, unknown>> = {},
  TMultiParams extends keyof TParams = never,
>({
  method,
  params = {} as never,
  responseSchema,
  getQueryKey,
  multiParams = [] as Array<TMultiParams>,
  select = (output) => output as Selected,
}: {
  method: string;
  params?: {
    [K in keyof TParams]: v.GenericSchema<TParams[K]>;
  };
  responseSchema: TResponseSchema;
  getQueryKey: (params: TParams) => TQueryKey;
  select?: (output: v.InferOutput<TResponseSchema>) => Selected;
  multiParams?: Array<TMultiParams>;
}) => {
  const parseParams = makeParamsParser(unsafeKeys(params), multiParams);
  return {
    predicate: ({ request }: { request: Request }) => {
      const url = new URL(request.url);
      const matches =
        url.hostname === "ws.audioscrobbler.com" &&
        url.pathname === "/2.0" &&
        url.searchParams.get("method") === method;
      return {
        matches,
        params: matches ? parseParams(url.searchParams) : ({} as never),
      } satisfies ReturnType<HttpCustomPredicate<PathParams<keyof TParams>>>;
    },
    queryOptions: (
      ...[params = {} as TParams]: HasRequiredProps<
        TParams,
        [TParams],
        [TParams?]
      >
    ) =>
      queryOptions({
        queryKey: ["lastfm", ...getQueryKey(params)],
        async queryFn({ signal }) {
          const response = await fetchWithSchema(
            {
              searchParams: { method, ...params },
              signal,
            },
            responseSchema,
          );
          return select(response);
        },
      }),
  };
};

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

export const getRecentTracks = buildEndpoint({
  method: "user.getRecentTracks",
  params: {
    limit: v.number(),
  },
  responseSchema: v.object({
    recenttracks: v.object({
      track: v.array(recentTrackSchema),
    }),
  }),
  getQueryKey: ({ limit }) => ["recent-tracks", { limit }],
  select: (res) => res.recenttracks.track,
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
  "7day": "7 days",
  "1month": "30 days",
  "3month": "3 months",
  "6month": "6 months",
  "12month": "12 months",
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

export const getTopTracks = buildEndpoint({
  method: "user.getTopTracks",
  params: {
    period: periodSchema,
    limit: v.number(),
  },
  responseSchema: v.object({
    toptracks: v.object({
      track: v.array(topTrackSchema),
    }),
  }),
  getQueryKey: ({ period, limit }) => ["top-tracks", { period, limit }],
  select: (res) => res.toptracks.track,
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

export const getTopArtists = buildEndpoint({
  method: "user.getTopArtists",
  params: {
    period: periodSchema,
    limit: v.number(),
  },
  responseSchema: topArtistsResponseSchema,
  getQueryKey: ({ period, limit }) => ["top-artists", { period, limit }],
  select: (res) => res.topartists.artist,
});

const userDataSchema = v.object({
  playcount: vUtils.coerceNumber,
  artist_count: vUtils.coerceNumber,
  track_count: vUtils.coerceNumber,
  album_count: vUtils.coerceNumber,
});

export type UserData = v.InferOutput<typeof userDataSchema>;

export const getUserData = buildEndpoint({
  method: "user.getInfo",
  responseSchema: v.object({
    user: userDataSchema,
  }),
  getQueryKey: () => ["user"],
  select: (res) => res.user,
});
