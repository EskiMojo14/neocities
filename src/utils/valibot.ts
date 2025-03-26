import type { GenericSchema } from "valibot";
import * as v from "valibot";

export const formDataShape = <
  T extends Record<
    string,
    GenericSchema<FormDataEntryValue | undefined, unknown>
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

export const coerceNumber = v.pipe(v.string(), v.transform(Number), v.number());

export const json = <T extends GenericSchema>(
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
