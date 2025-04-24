import { describe, expect, it } from "vitest";
import { cache } from "./lit.ts";

describe("cache", () => {
  it("caches the result of a getter based on the values returned by a function", () => {
    class Test {
      @cache(() => [])
      get value() {
        return Math.random();
      }
    }
    const test = new Test();
    expect(test.value).toBe(test.value);
  });
  it("recalculates the result of a getter when the values returned by a function change", () => {
    class Test {
      #cacheKey = 0;
      @cache((test) => [test.#cacheKey])
      get value() {
        return Math.random();
      }
      clearCache() {
        this.#cacheKey++;
      }
    }
    const test = new Test();
    const before = test.value;
    expect(before).toBe(test.value);
    test.clearCache();
    const after = test.value;
    expect(before).not.toBe(after);
    expect(after).toBe(test.value);
  });
});
