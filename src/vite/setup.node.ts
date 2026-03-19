import "mix-n-matchers/vitest";
import { expect } from "vite-plus/test";
import { toHaveData } from "./matchers/to-have-data.ts";

expect.extend({
  toHaveData,
});
