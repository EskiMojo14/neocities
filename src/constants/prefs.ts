import * as v from "valibot";

export const pkgManagerSchema = v.picklist(["npm", "pnpm", "yarn", "bun"]);

export type PackageManager = v.InferOutput<typeof pkgManagerSchema>;

export const installCommands: Record<PackageManager, string> = {
  npm: "install",
  pnpm: "add",
  yarn: "add",
  bun: "add",
};

export const themeSchema = v.picklist(["light", "dark"]);

export type Theme = v.InferOutput<typeof themeSchema>;
