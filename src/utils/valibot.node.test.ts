import * as v from "valibot";
import { describe, expect, it } from "vitest";
import * as vUtils from "./valibot.ts";

describe("valibot utils", () => {
  describe("formDataShape", () => {
    it("should parse a valid FormData", () => {
      const formData = new FormData();
      formData.append("foo", "bar");
      formData.append("baz", new File([], "baz"));
      expect(
        v.parse(
          vUtils.formDataShape({
            foo: v.string(),
            baz: v.file(),
          }),
          formData,
        ),
      ).toEqual(Object.fromEntries(formData.entries()));
    });

    it("should throw an error if not a FormData", () => {
      expect(() =>
        v.parse(
          vUtils.formDataShape({
            foo: v.string(),
          }),
          null,
        ),
      ).toThrowErrorMatchingInlineSnapshot(
        `[ValiError: Invalid type: Expected FormData but received null]`,
      );
    });

    it("should throw an error if the FormData does not match the schema", () => {
      expect(() => {
        const formData = new FormData();
        formData.append("foo", "bar");
        v.parse(
          vUtils.formDataShape({
            foo: v.file(),
          }),
          formData,
        );
      }).toThrowErrorMatchingInlineSnapshot(
        `[ValiError: Invalid type: Expected File but received "bar"]`,
      );
    });
  });
  describe("coerceNumber", () => {
    it("should coerce a string to a number", () => {
      expect(v.parse(vUtils.coerceNumber, "1")).toBe(1);
    });

    it("should throw an error if the string is not a number", () => {
      expect(() =>
        v.parse(vUtils.coerceNumber, "a"),
      ).toThrowErrorMatchingInlineSnapshot(
        `[ValiError: Invalid type: Expected number but received NaN]`,
      );
    });

    it("should throw an error if not a string", () => {
      expect(() =>
        v.parse(vUtils.coerceNumber, null),
      ).toThrowErrorMatchingInlineSnapshot(
        `[ValiError: Invalid type: Expected string but received null]`,
      );
    });
  });
  describe("json", () => {
    it("should parse a valid JSON string", () => {
      expect(
        v.parse(vUtils.json(v.object({ foo: v.string() })), '{"foo":"bar"}'),
      ).toEqual({ foo: "bar" });
    });

    it("should throw an error if the JSON is invalid", () => {
      expect(() =>
        v.parse(vUtils.json(v.object({ foo: v.string() })), '{"foo":"bar"'),
      ).toThrowErrorMatchingInlineSnapshot(
        `[ValiError: Expected ',' or '}' after property value in JSON at position 12 (line 1 column 13)]`,
      );
    });

    it("should throw an error if the JSON is not a string", () => {
      expect(() =>
        v.parse(vUtils.json(v.object({ foo: v.string() })), null),
      ).toThrowErrorMatchingInlineSnapshot(
        `[ValiError: Invalid type: Expected string but received null]`,
      );
    });

    it("should throw an error if the JSON does not match the schema", () => {
      expect(() =>
        v.parse(vUtils.json(v.object({ foo: v.string() })), '{"foo":1}'),
      ).toThrowErrorMatchingInlineSnapshot(
        `[ValiError: Invalid type: Expected string but received 1]`,
      );
    });
    it("should parse a valid JSON string with a reviver", () => {
      expect(
        v.parse(
          vUtils.json(v.object({ foo: v.string() }), (key, value): unknown =>
            key === "foo" ? String(value).toUpperCase() : value,
          ),
          '{"foo":"bar"}',
        ),
      ).toEqual({ foo: "BAR" });
    });
  });
});
