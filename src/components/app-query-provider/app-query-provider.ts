import { QueryClientProvider } from "@tanstack/lit-query";
import { customElement } from "lit/decorators.js";
import { queryClient } from "../../data/query.ts";

@customElement("app-query-provider")
export class AppQueryProvider extends QueryClientProvider {
  client = queryClient;
}
