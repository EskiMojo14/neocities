import type { StandardSchemaV1Dictionary } from "@standard-schema/utils";
import type { SearchParamsOption } from "ky";
import type {
  DefaultBodyType,
  HttpResponseResolver,
  RequestHandlerOptions,
} from "msw";
import { http } from "msw";
import type * as v from "valibot";
import { unsafeFromEntries, unsafeKeys } from "../utils/index.ts";

export const mockEndpoint = <
  TResponseSchema extends v.GenericSchema<DefaultBodyType>,
  TParamsDict extends StandardSchemaV1Dictionary<
    Extract<SearchParamsOption, Record<string, unknown>>
  >,
  TMultiParams extends keyof TParamsDict = never,
>(
  {
    method,
    paramsSchema,
    multiParams,
  }: {
    method: string;
    paramsSchema: TParamsDict;
    responseSchema: TResponseSchema;
    multiParams: Array<TMultiParams>;
  },
  resolver: HttpResponseResolver<
    {
      [K in keyof TParamsDict]: K extends TMultiParams
        ? ReadonlyArray<string>
        : string;
    },
    never,
    v.InferInput<TResponseSchema>
  >,
  options?: RequestHandlerOptions,
) =>
  http.get(
    ({ request }) => {
      const url = new URL(request.url);
      const matches =
        url.hostname === "ws.audioscrobbler.com" &&
        url.pathname === "/2.0/" &&
        url.searchParams.get("format") === "json" &&
        url.searchParams.get("method") === method;
      return (
        matches && {
          matches,
          params: unsafeFromEntries(
            unsafeKeys(paramsSchema).map((key) => [
              key,
              multiParams.includes(key as never)
                ? url.searchParams.getAll(key)
                : (url.searchParams.get(key) ?? ""),
            ]),
          ) as never,
        }
      );
    },
    resolver,
    options,
  );
