import * as v from "valibot";

export const pkgManagerSchema = v.fallback(
  v.picklist(["npm", "pnpm", "yarn", "bun"]),
  "pnpm",
);

export type PackageManager = v.InferOutput<typeof pkgManagerSchema>;

export const installCommands: Record<PackageManager, string> = {
  npm: "install",
  pnpm: "add",
  yarn: "add",
  bun: "add",
};

export const themeSchema = v.fallback(
  v.picklist(["system", "light", "dark"]),
  "system",
);

export type Theme = v.InferOutput<typeof themeSchema>;
