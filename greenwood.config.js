import { greenwoodPluginImportRaw } from "@greenwood/plugin-import-raw";
import { greenwoodPluginRendererLit } from "@greenwood/plugin-renderer-lit";
import { greenwoodPluginTypeScript } from "@greenwood/plugin-typescript";

export default {
  prerender: true,
  activeContent: true,
  isolation: true,
  plugins: [
    greenwoodPluginTypeScript({
      servePage: false,
      extendConfig: true,
    }),
    greenwoodPluginRendererLit({}),
    greenwoodPluginImportRaw(),
  ],
};
