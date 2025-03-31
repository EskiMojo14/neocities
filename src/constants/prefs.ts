import * as v from "valibot";

const createPref =
  <Meta>() =>
  <const Opts extends ReadonlyArray<string>, Fallback extends Opts[number]>(
    options: Opts,
    fallback: Fallback,
    {
      dataKey,
      storageKey = dataKey,
      storage = localStorage,
      ...config
    }: {
      meta: Record<Opts[number], Meta>;
      dataKey: string;
      storageKey?: string;
      storage?: Storage;
    },
  ) => {
    type T = v.InferOutput<typeof schema>;
    const schema = v.fallback(v.picklist(options), fallback);
    return {
      schema,
      fallback,
      dataKey,
      get data() {
        return v.parse(schema, document.documentElement.dataset[dataKey]);
      },
      set data(value: T) {
        document.documentElement.dataset[dataKey] = value;
      },
      storageKey,
      get storage() {
        return v.parse(schema, storage.getItem(storageKey));
      },
      set storage(value: T) {
        storage.setItem(storageKey, value);
      },
      ...config,
    };
  };

export const pkgManagerPref = createPref<{ install: string }>()(
  ["npm", "pnpm", "yarn", "bun"],
  "pnpm",
  {
    dataKey: "pm",
    storageKey: "packageManager",
    meta: {
      npm: { install: "install" },
      pnpm: { install: "add" },
      yarn: { install: "add" },
      bun: { install: "add" },
    },
  },
);

export type PackageManager = v.InferOutput<typeof pkgManagerPref.schema>;

export const themePref = createPref<{ icon: string }>()(
  ["system", "light", "dark"],
  "system",
  {
    dataKey: "theme",
    meta: {
      system: { icon: "routine" },
      light: { icon: "light_mode" },
      dark: { icon: "dark_mode" },
    },
  },
);

export type Theme = v.InferOutput<typeof themePref.schema>;

export const casePref = createPref<{ icon: string }>()(
  ["lower", "normal"],
  "lower",
  {
    dataKey: "case",
    meta: {
      lower: { icon: "lowercase" },
      normal: { icon: "match_case" },
    },
  },
);

export type Case = v.InferOutput<typeof casePref.schema>;
