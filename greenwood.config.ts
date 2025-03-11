import type { Config } from "@greenwood/cli";
import { greenwoodPluginImportRaw } from "@greenwood/plugin-import-raw";
import { greenwoodPluginRendererLit } from "@greenwood/plugin-renderer-lit";

export default {
  prerender: true,
  activeContent: true,
  isolation: true,
  plugins: [greenwoodPluginRendererLit(), greenwoodPluginImportRaw()],
  markdown: {
    plugins: ["@mapbox/rehype-prism"],
  },
  useTsc: true,
} satisfies Config;
