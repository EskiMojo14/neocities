import { http, HttpResponse } from "msw";
import { setupWorker } from "msw/browser";
import pages from "./graph.json";

export const worker = setupWorker(
  http.get(/localhost:\d+\/___graph.json/, () => HttpResponse.json(pages)),
);
