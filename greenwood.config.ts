import type { Config } from "@greenwood/cli";
import { greenwoodPluginImportRaw } from "@greenwood/plugin-import-raw";
import { greenwoodPluginPostCss } from "@greenwood/plugin-postcss";
import { greenwoodPluginRendererLit } from "@greenwood/plugin-renderer-lit";
import { tagsPlugin } from "./src/greenwood/tags.ts";

export default {
  prerender: true,
  activeContent: true,
  isolation: true,
  plugins: [
    greenwoodPluginRendererLit(),
    greenwoodPluginPostCss(),
    greenwoodPluginImportRaw(),
    tagsPlugin(),
  ],
  markdown: {
    plugins: ["@mapbox/rehype-prism"],
  },
  useTsc: true,
} satisfies Config;
