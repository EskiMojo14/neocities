import { nothing } from "lit";

type QueryResultRenderers<Result extends { status: string }> = {
  [Status in Result["status"]]?: (result: Extract<Result, { status: Status }>) => unknown;
};

type RendererResult<
  // oxlint-disable-next-line @typescript-eslint/no-explicit-any
  Renderer extends QueryResultRenderers<any>,
> = {
  [Status in keyof Renderer]: Renderer[Status] extends (
    // oxlint-disable-next-line @typescript-eslint/no-explicit-any
    ...args: Array<any>
  ) => infer R
    ? R
    : typeof nothing;
}[keyof Renderer];

export function renderQueryResult<
  TResult extends { status: string },
  TRenderers extends QueryResultRenderers<TResult>,
>(accessor: { current: TResult }, renderers: TRenderers): RendererResult<TRenderers> {
  return (renderers[accessor.current.status as keyof TRenderers]?.(accessor.current as never) ??
    nothing) as RendererResult<TRenderers>;
}
