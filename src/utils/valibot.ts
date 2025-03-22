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
