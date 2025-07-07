import type {
  QueryKey,
  QueryObserverOptions,
  QueryObserverResult,
} from "@tanstack/query-core";
import { QueryObserver } from "@tanstack/query-core";
import type { LitElement, ReactiveController } from "lit";
import { nothing } from "lit";
import { queryClient } from "../data/query.ts";

type QueryResultRenderers<TData, TError> = {
  [Status in QueryObserverResult["status"]]?: (
    result: Extract<QueryObserverResult<TData, TError>, { status: Status }>,
  ) => unknown;
} & {
  initial?: () => unknown;
};

type RendererResult<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Renderer extends QueryResultRenderers<any, any>,
> = {
  [Status in keyof Renderer]: Renderer[Status] extends (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...args: Array<any>
  ) => infer R
    ? R
    : typeof nothing;
}[keyof Renderer];

// based on https://github.com/TanStack/query/pull/7715/

export class QueryController<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  const TQueryKey extends QueryKey = QueryKey,
> implements ReactiveController
{
  protected host: LitElement;
  private getOptions: () => QueryObserverOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryData,
    TQueryKey
  >;

  private whenQueryObserver =
    Promise.withResolvers<
      QueryObserver<TQueryFnData, TError, TData, TQueryData, TQueryKey>
    >();
  queryObserver?: QueryObserver<
    TQueryFnData,
    TError,
    TData,
    TQueryData,
    TQueryKey
  >;

  result?: QueryObserverResult<TData, TError>;

  constructor(
    host: LitElement,
    getOptions: () => QueryObserverOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryData,
      TQueryKey
    >,
  ) {
    (this.host = host).addController(this);
    this.getOptions = getOptions;
    this.observeQuery();
  }

  private observeQuery(optimistic = true) {
    this.queryObserver = new QueryObserver(queryClient, this.getOptions());
    if (optimistic) {
      this.result = this.queryObserver.getOptimisticResult(
        queryClient.defaultQueryOptions(this.getOptions()),
      );
    } else {
      this.result = undefined;
    }

    this.host.requestUpdate();

    this.whenQueryObserver.resolve(this.queryObserver);
  }

  hostConnected() {
    void this.subscribe();
  }

  protected unsubscribe?: () => void;

  async subscribe() {
    const queryObserver = await this.whenQueryObserver.promise;
    this.unsubscribe = queryObserver.subscribe((result) => {
      this.result = result;
      this.host.requestUpdate();
    });

    queryObserver.updateResult();
    this.host.requestUpdate();
  }

  hostDisconnected() {
    this.unsubscribe?.();
    this.unsubscribe = undefined;
  }

  hostUpdate() {
    void this.whenQueryObserver.promise.then((queryObserver) => {
      queryObserver.setOptions(this.getOptions());
    });
  }

  render<TRenderers extends QueryResultRenderers<TData, TError>>(
    renderers: TRenderers,
  ): RendererResult<TRenderers> {
    const renderer = !this.result
      ? renderers.initial
      : renderers[this.result.status];
    return (
      renderer ? renderer(this.result as never) : nothing
    ) as RendererResult<TRenderers>;
  }
}
