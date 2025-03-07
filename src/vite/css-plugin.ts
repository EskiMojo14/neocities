import fs from "fs/promises";
import path from "path";
// 1) import the greenwood plugin and lifecycle helpers
import { readAndMergeConfig } from "@greenwood/cli/src/lifecycles/config.js";
import { initContext } from "@greenwood/cli/src/lifecycles/context.js";
import { greenwoodPluginStandardCss } from "@greenwood/cli/src/plugins/resource/plugin-standard-css.js";
import type { Plugin } from "vite";

// 2) initialize Greenwood lifecycles
const config = await readAndMergeConfig();
const context = await initContext({ config });
const compilation = { context, config };

// 3) initialize the plugin
const standardCssResource = greenwoodPluginStandardCss.provider(compilation);

// 4) customize Vite
export function transformConstructableStylesheetsPlugin(): Plugin {
  return {
    name: "transform-constructable-stylesheets",
    enforce: "pre",
    resolveId: (id, importer) => {
      if (
        // you'll need to configure this `importer` line to the location of your own components
        importer?.includes("/src/components/") &&
        id.endsWith(".css") &&
        !id.endsWith(".module.css")
      ) {
        // add .type so Constructable Stylesheets  are not precessed by Vite's default pipeline
        return path.join(path.dirname(importer), `${id}.type`);
      }
    },
    load: async (id) => {
      if (id.endsWith(".css.type")) {
        const filename = id.slice(0, -5);
        const contents = await fs.readFile(filename, "utf-8");
        const url = new URL(`file://${id.replace(".type", "")}`);
        // "coerce" native constructable stylesheets into inline JS so Vite / Rollup do not complain
        const request = new Request(url, {
          headers: {
            Accept: "text/javascript",
          },
        });
        const response = await standardCssResource.intercept(
          url,
          request,
          new Response(contents),
        );
        const body = await response.text();

        return body;
      }
    },
  };
}
