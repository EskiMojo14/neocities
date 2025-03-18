import "mix-n-matchers/vitest";
import { expect } from "vitest";
import { toHaveData } from "./matchers/to-have-data.ts";

expect.extend({
  toHaveData,
});
