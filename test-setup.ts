import { expect } from "vitest";
import { toHaveFocusDeep } from "./src/vite/matchers/to-have-focus-deep.ts";

expect.extend({
  toHaveFocusDeep,
});
