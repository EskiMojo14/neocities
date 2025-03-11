import fs from "fs/promises";
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
const rawResource = greenwoodPluginImportRaw()[0].provider(compilation);

// 4) customize Vite
export function transformRawImports(): Plugin {
  return {
    name: "transform-raw-imports",
    enforce: "pre",
    load: async (id) => {
      if (id.endsWith("?type=raw")) {
        const filename = id.slice(0, -9);
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
