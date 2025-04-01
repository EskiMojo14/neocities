import * as v from "valibot";
import { objectKeys } from "../utils/index.ts";

const createPref =
  <Meta>() =>
  <const Opt extends string, Fallback extends Opt>(
    meta: Record<Opt, Meta>,
    fallback: Fallback,
    {
      dataKey,
      storageKey = dataKey,
    }: {
      dataKey: string;
      storageKey?: string;
    },
  ) => {
    const options = objectKeys(meta);
    const schema = v.fallback(v.picklist(options), fallback);
    return {
      options,
      fallback,
      meta,
      schema,
      dataKey,
      get data() {
        return v.parse(schema, document.documentElement.dataset[dataKey]);
      },
      set data(value) {
        document.documentElement.dataset[dataKey] = value;
      },
      storageKey,
      get storage() {
        return v.parse(schema, localStorage.getItem(storageKey));
      },
      set storage(value) {
        localStorage.setItem(storageKey, value);
      },
    };
  };

export const pkgManagerPref = createPref<{
  install: string;
  prefix?: string;
}>()(
  {
    npm: { install: "install" },
    pnpm: { install: "add" },
    yarn: { install: "add" },
    bun: { install: "add" },
    deno: { install: "add", prefix: "npm:" },
  },
  "pnpm",
  {
    dataKey: "pm",
    storageKey: "packageManager",
  },
);

export type PackageManager = v.InferOutput<typeof pkgManagerPref.schema>;

export const themePref = createPref<{ icon: string }>()(
  {
    system: { icon: "routine" },
    light: { icon: "light_mode" },
    dark: { icon: "dark_mode" },
  },
  "system",
  {
    dataKey: "theme",
  },
);

export type Theme = v.InferOutput<typeof themePref.schema>;

export const stylePref = createPref<{ icon: string }>()(
  {
    code: { icon: "code" },
    normal: { icon: "match_case" },
  },
  "code",
  {
    dataKey: "style",
  },
);

export type Style = v.InferOutput<typeof stylePref.schema>;
