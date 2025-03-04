import { greenwoodPluginRendererLit } from "@greenwood/plugin-renderer-lit";
import { greenwoodPluginTypeScript } from "@greenwood/plugin-typescript";

export default {
  prerender: true,
  plugins: [
    greenwoodPluginTypeScript({
      servePage: false,
      extendConfig: true,
    }),
    greenwoodPluginRendererLit({}),
  ],
};
