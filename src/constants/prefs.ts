import * as v from "valibot";
import type { Compute } from "../utils/index.ts";

function createPref<
  Schema extends v.SchemaWithFallback<v.GenericSchema<string>, string>,
  Config extends {
    icons?: Record<v.InferOutput<Schema>, string>;
    dataKey: string;
    storageKey?: string;
  },
>(
  schema: Schema,
  config: Config,
): Compute<
  Config & {
    storageKey: string;
    schema: Schema;
    fallback: v.InferFallback<Schema>;
  }
> {
  return {
    ...config,
    storageKey: config.storageKey ?? config.dataKey,
    schema,
    fallback: v.getFallback(schema),
  };
}

export const pkgManagerPref = createPref(
  v.fallback(v.picklist(["npm", "pnpm", "yarn", "bun"]), "pnpm"),
  { dataKey: "pm", storageKey: "packageManager" },
);

export type PackageManager = v.InferOutput<typeof pkgManagerPref.schema>;

export const installCommands: Record<PackageManager, string> = {
  npm: "install",
  pnpm: "add",
  yarn: "add",
  bun: "add",
};

export const themePref = createPref(
  v.fallback(v.picklist(["system", "light", "dark"]), "system"),
  {
    dataKey: "theme",
    icons: {
      system: "routine",
      light: "light_mode",
      dark: "dark_mode",
    },
  },
);

export type Theme = v.InferOutput<typeof themePref.schema>;

export const dirSchema = v.fallback(v.picklist(["auto", "ltr", "rtl"]), "auto");

export type Dir = v.InferOutput<typeof dirSchema>;

export const casePref = createPref(
  v.fallback(v.picklist(["lower", "normal"]), "lower"),
  {
    dataKey: "case",
    icons: {
      lower: "lowercase",
      normal: "match_case",
    },
  },
);

export type Case = v.InferOutput<typeof casePref.schema>;
