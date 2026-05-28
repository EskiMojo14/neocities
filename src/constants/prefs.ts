import * as v from "valibot";
import { unsafeKeys } from "../utils/index.ts";
import { createContext } from "@lit/context";

const createPref =
  <Meta>() =>
  <const Opt extends string, Fallback extends Opt, Key>(
    key: Key,
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
    const options = unsafeKeys(meta);
    const parser = v.parser(v.fallback(v.picklist(options), fallback));
    return {
      context: createContext<Opt, Key>(key),
      options,
      fallback,
      meta,
      parser,
      dataKey,
      get data() {
        return parser(document.documentElement.dataset[dataKey]);
      },
      set data(value) {
        document.documentElement.dataset[dataKey] = value;
      },
      storageKey,
      get storage() {
        return parser(localStorage.getItem(storageKey));
      },
      set storage(value) {
        localStorage.setItem(storageKey, value);
      },
      _type: null as unknown as Opt,
    };
  };

export const pkgManagerPref = createPref<{
  install: string;
  prefix?: string;
}>()(
  Symbol("packageManager"),
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

export type PackageManager = (typeof pkgManagerPref.options)[number];

export const themePref = createPref<{ icon: string }>()(
  Symbol("theme"),
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

export type Theme = (typeof themePref.options)[number];

export const stylePref = createPref<{ icon: string }>()(
  Symbol("style"),
  {
    code: { icon: "code" },
    normal: { icon: "match_case" },
  },
  "code",
  {
    dataKey: "style",
  },
);

export type Style = (typeof stylePref.options)[number];
