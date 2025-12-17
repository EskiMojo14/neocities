import ky from "ky";
import * as v from "valibot";
import { queryOptions } from "./query.ts";

const downloadsResponseSchema = v.object({
  downloads: v.number(),
});

const api = ky.create({
  prefixUrl: "https://api.npmjs.org",
});

export const getMonthlyDownloads = (packageName: string) =>
  queryOptions({
    queryKey: ["npm", "downloads", "month", packageName],
    queryFn: async ({ signal }) => {
      const response = await api.get(
        `downloads/point/last-month/${encodeURIComponent(packageName)}`,
        { signal },
      );
      return v.parse(downloadsResponseSchema, await response.json());
    },
  });
