import * as v from "valibot";
import { queryOptions } from "./query.ts";
import { up } from "up-fetch";

const downloadsResponseSchema = v.object({
  downloads: v.number(),
});

const npmFetch = up(fetch, () => ({
  baseUrl: "https://api.npmjs.org",
}));

export const getMonthlyDownloads = (packageName: string) =>
  queryOptions({
    queryKey: ["npm", "downloads", "month", packageName],
    queryFn: ({ signal }) =>
      npmFetch(`downloads/point/last-month/${encodeURIComponent(packageName)}`, {
        signal,
        schema: downloadsResponseSchema,
      }),
  });
