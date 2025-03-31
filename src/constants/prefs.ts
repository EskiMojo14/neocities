import * as v from "valibot";
import type { Compute } from "../utils/index.ts";

function createPref<
  Schema extends v.SchemaWithFallback<v.GenericSchema<string>, string>,
  Meta extends Record<v.InferOutput<Schema>, unknown>,
  Config extends {
    dataKey: string;
    storageKey?: string;
  },
>(
  schema: Schema,
  meta: Meta,
  config: Config,
): Compute<
  Config & {
    storageKey: string;
    schema: Schema;
    fallback: v.InferFallback<Schema>;
    meta: Meta;
  }
> {
  return {
    ...config,
    storageKey: config.storageKey ?? config.dataKey,
    schema,
    fallback: v.getFallback(schema),
    meta,
  };
}

export const pkgManagerPref = createPref(
  v.fallback(v.picklist(["npm", "pnpm", "yarn", "bun"]), "pnpm"),
  {
    npm: { install: "install" },
    pnpm: { install: "add" },
    yarn: { install: "add" },
    bun: { install: "add" },
  },
  {
    dataKey: "pm",
    storageKey: "packageManager",
  },
);

export type PackageManager = v.InferOutput<typeof pkgManagerPref.schema>;

export const themePref = createPref(
  v.fallback(v.picklist(["system", "light", "dark"]), "system"),
  {
    system: { icon: "routine" },
    light: { icon: "light_mode" },
    dark: { icon: "dark_mode" },
  },
  {
    dataKey: "theme",
  },
);

export type Theme = v.InferOutput<typeof themePref.schema>;

export const dirSchema = v.fallback(v.picklist(["auto", "ltr", "rtl"]), "auto");

export type Dir = v.InferOutput<typeof dirSchema>;

export const casePref = createPref(
  v.fallback(v.picklist(["lower", "normal"]), "lower"),
  {
    lower: { icon: "lowercase" },
    normal: { icon: "match_case" },
  },
  {
    dataKey: "case",
  },
);

export type Case = v.InferOutput<typeof casePref.schema>;
