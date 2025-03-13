import fs from "fs/promises";
import path from 'path';
// 1) import the greenwood plugin and lifecycle helpers
import type { Compilation, Resource } from "@greenwood/cli";
import { readAndMergeConfig } from "@greenwood/cli/src/lifecycles/config.js";
import { initContext } from "@greenwood/cli/src/lifecycles/context.js";
import { greenwoodPluginImportRaw } from "@greenwood/plugin-import-raw";
import type { Plugin } from "vite";

// 2) initialize Greenwood lifecycles
const config = await readAndMergeConfig();
const compilation: Compilation = {
  context: await initContext({ config }),
  config,
  graph: [],
};

// 3) initialize the plugin
const rawResource: Resource = greenwoodPluginImportRaw()[0].provider(compilation);

// 4) customize Vite
export function transformRawImports(): Plugin {
  const hint = "?type=raw";

  return {
    name: "transform-raw-imports",
    enforce: "pre",
    // @ts-expect-error have to reconcile this vite config type-check
    resolveId: (id: string, importer: string) => {
      if (
        id.endsWith(hint)
      ) {
        // add .type so Raw imports are not precessed by Vite's default pipeline
        return path.join(path.dirname(importer), `${id.slice(0, id.indexOf(hint))}.type${hint}`);
      }
    },
    load: async (id) => {
      if (id.endsWith(hint)) {
        const filename = id.slice(0, id.indexOf(`.type${hint}`));
        const contents = await fs.readFile(filename, "utf-8");
        // @ts-expect-error Greenwood should allow all resource lifecycle args to be optional
        const response = await rawResource.intercept(new URL(`file://${filename}`), null, new Response(contents));
        const body = await response.text();

        return body;
      }
    },
  };
}
