import fs from "fs/promises";
import path from "path";
// 1) import the greenwood plugin and lifecycle helpers
import type { Compilation } from "@greenwood/cli";
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
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const rawResource = greenwoodPluginImportRaw()[0]!.provider(compilation);

// 4) customize Vite
export function transformRawImports(): Plugin {
  const hint = "?type=raw";

  return {
    name: "transform-raw-imports",
    enforce: "pre",
    resolveId: (id, importer) => {
      if (id.endsWith(hint)) {
        // add .type so Raw imports are not precessed by Vite's default pipeline
        return path.join(
          path.dirname(importer ?? ""),
          `${id.slice(0, id.indexOf(hint))}.type${hint}`,
        );
      }
    },
    load: async (id) => {
      if (id.endsWith(hint)) {
        const filename = id.slice(0, id.indexOf(`.type${hint}`));
        const contents = await fs.readFile(filename, "utf-8");

        /* eslint-disable @typescript-eslint/no-non-null-assertion */
        const response = await rawResource.intercept!(
          null!,
          null!,
          new Response(contents),
        );
        /* eslint-enable @typescript-eslint/no-non-null-assertion */
        const body = await response.text();

        return body;
      }
    },
  };
}
