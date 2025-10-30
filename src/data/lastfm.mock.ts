import type {
  DefaultBodyType,
  HttpResponseResolver,
  RequestHandlerOptions,
} from "msw";
import { http } from "msw";
import type * as v from "valibot";
import { unsafeFromEntries, unsafeKeys } from "../utils/index.ts";

export const mockEndpoint = <
  TResponse extends DefaultBodyType,
  TParamsEntries extends Record<string, unknown>,
  TMultiParams extends keyof TParamsEntries = never,
>(
  {
    method,
    paramsSchema,
    multiParams,
  }: {
    method: string;
    paramsSchema: { entries: TParamsEntries };
    responseSchema: v.GenericSchema<TResponse, unknown>;
    multiParams: Array<TMultiParams>;
  },
  resolver: HttpResponseResolver<
    {
      [K in keyof TParamsEntries]: K extends TMultiParams
        ? ReadonlyArray<string>
        : string;
    },
    never,
    TResponse
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
            unsafeKeys(paramsSchema.entries).map((key) => [
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
