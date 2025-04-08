import * as v from "valibot";

function objectifyFormData(formData: FormData) {
  const obj: Partial<
    Record<string, FormDataEntryValue | Array<FormDataEntryValue>>
  > = {};
  for (const [key, value] of formData.entries()) {
    if (!obj[key]) {
      obj[key] = value;
    } else if (Array.isArray(obj[key])) {
      obj[key].push(value);
    } else {
      obj[key] = [obj[key], value];
    }
  }
  return obj;
}

export const formDataShape = <
  T extends Record<
    string,
    v.GenericSchema<
      FormDataEntryValue | Array<FormDataEntryValue> | undefined,
      unknown
    >
  >,
>(
  shape: T,
) =>
  v.pipe(v.instance(FormData), v.transform(objectifyFormData), v.object(shape));

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
