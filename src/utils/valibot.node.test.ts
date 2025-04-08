import * as v from "valibot";
import { describe, expect, it } from "vitest";
import * as vUtils from "./valibot.ts";

expect.addSnapshotSerializer({
  test: (value) => value instanceof v.ValiError,
  serialize: (
    valiError: v.ValiError<v.GenericSchema>,
    config,
    indentation,
    depth,
    refs,
    printer,
  ) =>
    `[ValiError: ${valiError.message}]: ${printer(valiError.issues, config, indentation, depth, refs)}`,
});

describe("valibot utils", () => {
  describe("formDataShape", () => {
    it("should parse a valid FormData", () => {
      const file = new File([], "baz");
      const formData = new FormData();
      formData.append("foo", "bar");
      formData.append("baz", file);
      formData.append("multi", "one");
      formData.append("multi", "two");
      expect(
        v.parse(
          vUtils.formDataShape({
            foo: v.string(),
            baz: v.file(),
            multi: v.array(v.string()),
          }),
          formData,
        ),
      ).toEqual({
        foo: "bar",
        baz: file,
        multi: ["one", "two"],
      });
    });

    it("should throw an error if not a FormData", () => {
      expect(() =>
        v.parse(
          vUtils.formDataShape({
            foo: v.string(),
          }),
          null,
        ),
      ).toThrowErrorMatchingInlineSnapshot(`
        [ValiError: Invalid type: Expected FormData but received null]: [
          {
            "abortEarly": undefined,
            "abortPipeEarly": undefined,
            "expected": "FormData",
            "input": null,
            "issues": undefined,
            "kind": "schema",
            "lang": undefined,
            "message": "Invalid type: Expected FormData but received null",
            "path": undefined,
            "received": "null",
            "requirement": undefined,
            "type": "instance",
          },
        ]
      `);
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
      }).toThrowErrorMatchingInlineSnapshot(`
        [ValiError: Invalid type: Expected File but received "bar"]: [
          {
            "abortEarly": undefined,
            "abortPipeEarly": undefined,
            "expected": "File",
            "input": "bar",
            "issues": undefined,
            "kind": "schema",
            "lang": undefined,
            "message": "Invalid type: Expected File but received "bar"",
            "path": [
              {
                "input": {
                  "foo": "bar",
                },
                "key": "foo",
                "origin": "value",
                "type": "object",
                "value": "bar",
              },
            ],
            "received": ""bar"",
            "requirement": undefined,
            "type": "file",
          },
        ]
      `);
    });
  });
  describe("coerceNumber", () => {
    it("should coerce a string to a number", () => {
      expect(v.parse(vUtils.coerceNumber, "1")).toBe(1);
    });

    it("should throw an error if the string is not a number", () => {
      expect(() => v.parse(vUtils.coerceNumber, "a"))
        .toThrowErrorMatchingInlineSnapshot(`
          [ValiError: Invalid type: Expected number but received NaN]: [
            {
              "abortEarly": undefined,
              "abortPipeEarly": undefined,
              "expected": "number",
              "input": NaN,
              "issues": undefined,
              "kind": "schema",
              "lang": undefined,
              "message": "Invalid type: Expected number but received NaN",
              "path": undefined,
              "received": "NaN",
              "requirement": undefined,
              "type": "number",
            },
          ]
        `);
    });
  });
  describe("coerceDate", () => {
    it("should coerce a string to a date", () => {
      expect(v.parse(vUtils.coerceDate, "2020-01-01")).toEqual(
        new Date("2020-01-01"),
      );
    });

    it("should throw an error if the string is not a date", () => {
      expect(() => v.parse(vUtils.coerceDate, "a"))
        .toThrowErrorMatchingInlineSnapshot(`
        [ValiError: Invalid type: Expected Date but received "Invalid Date"]: [
          {
            "abortEarly": undefined,
            "abortPipeEarly": undefined,
            "expected": "Date",
            "input": Date { NaN },
            "issues": undefined,
            "kind": "schema",
            "lang": undefined,
            "message": "Invalid type: Expected Date but received "Invalid Date"",
            "path": undefined,
            "received": ""Invalid Date"",
            "requirement": undefined,
            "type": "date",
          },
        ]
      `);
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
      ).toThrowErrorMatchingInlineSnapshot(`
        [ValiError: Expected ',' or '}' after property value in JSON at position 12 (line 1 column 13)]: [
          {
            "abortEarly": undefined,
            "abortPipeEarly": undefined,
            "expected": null,
            "input": "{"foo":"bar"",
            "issues": undefined,
            "kind": "transformation",
            "lang": undefined,
            "message": "Expected ',' or '}' after property value in JSON at position 12 (line 1 column 13)",
            "path": undefined,
            "received": ""{"foo":"bar""",
            "requirement": undefined,
            "type": "raw_transform",
          },
        ]
      `);
    });

    it("should throw an error if the JSON is not a string", () => {
      expect(() => v.parse(vUtils.json(v.object({ foo: v.string() })), null))
        .toThrowErrorMatchingInlineSnapshot(`
          [ValiError: Invalid type: Expected string but received null]: [
            {
              "abortEarly": undefined,
              "abortPipeEarly": undefined,
              "expected": "string",
              "input": null,
              "issues": undefined,
              "kind": "schema",
              "lang": undefined,
              "message": "Invalid type: Expected string but received null",
              "path": undefined,
              "received": "null",
              "requirement": undefined,
              "type": "string",
            },
          ]
        `);
    });

    it("should throw an error if the JSON does not match the schema", () => {
      expect(() =>
        v.parse(vUtils.json(v.object({ foo: v.string() })), '{"foo":1}'),
      ).toThrowErrorMatchingInlineSnapshot(`
        [ValiError: Invalid type: Expected string but received 1]: [
          {
            "abortEarly": undefined,
            "abortPipeEarly": undefined,
            "expected": "string",
            "input": 1,
            "issues": undefined,
            "kind": "schema",
            "lang": undefined,
            "message": "Invalid type: Expected string but received 1",
            "path": [
              {
                "input": {
                  "foo": 1,
                },
                "key": "foo",
                "origin": "value",
                "type": "object",
                "value": 1,
              },
            ],
            "received": "1",
            "requirement": undefined,
            "type": "string",
          },
        ]
      `);
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
  describe("maybeJson", () => {
    it("should parse a valid JSON string", () => {
      expect(
        v.parse(
          vUtils.maybeJson(v.object({ foo: v.string() })),
          '{"foo":"bar"}',
        ),
      ).toEqual({ foo: "bar" });
    });

    it("should parse a valid object", () => {
      expect(
        v.parse(vUtils.maybeJson(v.object({ foo: v.string() })), {
          foo: "bar",
        }),
      ).toEqual({ foo: "bar" });
    });

    it("should throw an error if the JSON is invalid", () => {
      expect(() =>
        v.parse(
          vUtils.maybeJson(v.object({ foo: v.string() })),
          '{"foo":"bar"',
        ),
      ).toThrowErrorMatchingInlineSnapshot(`
        [ValiError: Invalid type: Expected (Object | string) but received "{"foo":"bar""]: [
          {
            "abortEarly": undefined,
            "abortPipeEarly": undefined,
            "expected": "(Object | string)",
            "input": "{"foo":"bar"",
            "issues": [
              {
                "abortEarly": undefined,
                "abortPipeEarly": undefined,
                "expected": "Object",
                "input": "{"foo":"bar"",
                "issues": undefined,
                "kind": "schema",
                "lang": undefined,
                "message": "Invalid type: Expected Object but received "{"foo":"bar""",
                "path": undefined,
                "received": ""{"foo":"bar""",
                "requirement": undefined,
                "type": "object",
              },
              {
                "abortEarly": undefined,
                "abortPipeEarly": undefined,
                "expected": null,
                "input": "{"foo":"bar"",
                "issues": undefined,
                "kind": "transformation",
                "lang": undefined,
                "message": "Expected ',' or '}' after property value in JSON at position 12 (line 1 column 13)",
                "path": undefined,
                "received": ""{"foo":"bar""",
                "requirement": undefined,
                "type": "raw_transform",
              },
            ],
            "kind": "schema",
            "lang": undefined,
            "message": "Invalid type: Expected (Object | string) but received "{"foo":"bar""",
            "path": undefined,
            "received": ""{"foo":"bar""",
            "requirement": undefined,
            "type": "union",
          },
        ]
      `);
    });
    it("should throw an error if the JSON does not match the schema", () => {
      expect(() =>
        v.parse(vUtils.maybeJson(v.object({ foo: v.string() })), '{"foo":1}'),
      ).toThrowErrorMatchingInlineSnapshot(`
        [ValiError: Invalid type: Expected (Object | string) but received "{"foo":1}"]: [
          {
            "abortEarly": undefined,
            "abortPipeEarly": undefined,
            "expected": "(Object | string)",
            "input": "{"foo":1}",
            "issues": [
              {
                "abortEarly": undefined,
                "abortPipeEarly": undefined,
                "expected": "Object",
                "input": "{"foo":1}",
                "issues": undefined,
                "kind": "schema",
                "lang": undefined,
                "message": "Invalid type: Expected Object but received "{"foo":1}"",
                "path": undefined,
                "received": ""{"foo":1}"",
                "requirement": undefined,
                "type": "object",
              },
              {
                "abortEarly": undefined,
                "abortPipeEarly": undefined,
                "expected": "string",
                "input": 1,
                "issues": undefined,
                "kind": "schema",
                "lang": undefined,
                "message": "Invalid type: Expected string but received 1",
                "path": [
                  {
                    "input": {
                      "foo": 1,
                    },
                    "key": "foo",
                    "origin": "value",
                    "type": "object",
                    "value": 1,
                  },
                ],
                "received": "1",
                "requirement": undefined,
                "type": "string",
              },
            ],
            "kind": "schema",
            "lang": undefined,
            "message": "Invalid type: Expected (Object | string) but received "{"foo":1}"",
            "path": undefined,
            "received": ""{"foo":1}"",
            "requirement": undefined,
            "type": "union",
          },
        ]
      `);
    });
    it("should throw an error if the object does not match the schema", () => {
      expect(() =>
        v.parse(vUtils.maybeJson(v.object({ foo: v.string() })), { foo: 1 }),
      ).toThrowErrorMatchingInlineSnapshot(`
        [ValiError: Invalid type: Expected (Object | string) but received Object]: [
          {
            "abortEarly": undefined,
            "abortPipeEarly": undefined,
            "expected": "(Object | string)",
            "input": {
              "foo": 1,
            },
            "issues": [
              {
                "abortEarly": undefined,
                "abortPipeEarly": undefined,
                "expected": "string",
                "input": 1,
                "issues": undefined,
                "kind": "schema",
                "lang": undefined,
                "message": "Invalid type: Expected string but received 1",
                "path": [
                  {
                    "input": {
                      "foo": 1,
                    },
                    "key": "foo",
                    "origin": "value",
                    "type": "object",
                    "value": 1,
                  },
                ],
                "received": "1",
                "requirement": undefined,
                "type": "string",
              },
              {
                "abortEarly": undefined,
                "abortPipeEarly": undefined,
                "expected": "string",
                "input": {
                  "foo": 1,
                },
                "issues": undefined,
                "kind": "schema",
                "lang": undefined,
                "message": "Invalid type: Expected string but received Object",
                "path": undefined,
                "received": "Object",
                "requirement": undefined,
                "type": "string",
              },
            ],
            "kind": "schema",
            "lang": undefined,
            "message": "Invalid type: Expected (Object | string) but received Object",
            "path": undefined,
            "received": "Object",
            "requirement": undefined,
            "type": "union",
          },
        ]
      `);
    });
  });
});
