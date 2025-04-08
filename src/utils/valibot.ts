import * as v from "valibot";

export const formDataShape = <
  T extends Record<
    string,
    v.GenericSchema<FormDataEntryValue | undefined, unknown>
  >,
>(
  shape: T,
) =>
  v.pipe(
    v.instance(FormData),
    v.transform(
      (formData): Partial<Record<string, FormDataEntryValue>> =>
        Object.fromEntries(formData.entries()),
    ),
    v.object(shape),
  );

export const coerceNumber = v.pipe(v.any(), v.transform(Number), v.number());

export const coerceDate = v.pipe(
  v.union([v.string(), v.number(), v.date()]),
  v.transform((date) => new Date(date)),
  v.date(),
  v.check((date) => !Number.isNaN(date.getTime()), "Invalid date"),
);

export const json = <T extends v.GenericSchema>(
  schema: T,
  reviver?: Parameters<typeof JSON.parse>[1],
) =>
  v.pipe(
    v.string(),
    v.rawTransform(({ dataset, NEVER, addIssue }): unknown => {
      try {
        return JSON.parse(dataset.value, reviver);
      } catch (e) {
        addIssue({
          input: dataset.value,
          message: e instanceof Error ? e.message : "Failed to parse JSON",
        });
        return NEVER;
      }
    }),
    schema,
  );

export const maybeJson = <T extends v.GenericSchema>(schema: T) =>
  v.union([schema, json(schema)]);
