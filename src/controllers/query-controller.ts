import { nothing } from "lit";
import type { QueryResultAccessor, QueryObserverResult } from "@tanstack/lit-query";

type QueryResultRenderers<TData, TError> = {
  [Status in QueryObserverResult["status"]]?: (
    result: Extract<QueryObserverResult<TData, TError>, { status: Status }>,
  ) => unknown;
};

type RendererResult<
  // oxlint-disable-next-line @typescript-eslint/no-explicit-any
  Renderer extends QueryResultRenderers<any, any>,
> = {
  [Status in keyof Renderer]: Renderer[Status] extends (
    // oxlint-disable-next-line @typescript-eslint/no-explicit-any
    ...args: Array<any>
  ) => infer R
    ? R
    : typeof nothing;
}[keyof Renderer];

export function renderQueryResult<
  TData,
  TError,
  TRenderers extends QueryResultRenderers<TData, TError>,
>(accessor: QueryResultAccessor<TData, TError>, renderers: TRenderers): RendererResult<TRenderers> {
  return (renderers[accessor.current.status]?.(accessor.current as never) ??
    nothing) as RendererResult<TRenderers>;
}
