import type {
  QueryKey,
  QueryOptions,
  WithRequired,
} from "@tanstack/query-core";
import { QueryClient } from "@tanstack/query-core";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});

export function queryOptions<
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
  const TQueryKey extends QueryKey = ReadonlyArray<unknown>,
>(
  options: WithRequired<
    QueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    "queryKey"
  >,
) {
  return options;
}
