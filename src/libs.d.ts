declare module "*.module.css" {
  const classes: Readonly<Record<string, string>>;
  export default classes;
}

declare module "*?type=raw" {
  const source: string;
  export default source;
}

declare module "*.css" {
  const stylesheet: CSSStyleSheet;
  export default stylesheet;
}

declare module "@greenwood/cli/src/lifecycles/config.js" {
  import type { UserConfig } from "vite";
  export function readAndMergeConfig(): Promise<UserConfig>;
}

interface GreenwoodContext {}

declare module "@greenwood/cli/src/lifecycles/context.js" {
  import type { UserConfig } from "vite";
  export function initContext(opts: {
    config: UserConfig;
  }): Promise<GreenwoodContext>;
}

interface GreenwoodPlugin {
  provider: (compilation: {
    context: GreenwoodContext;
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    config: import("vite").UserConfig;
  }) => {
    intercept: (
      url: URL | null,
      request: Request | null,
      response: Response,
    ) => Promise<Response>;
  };
}

declare module "@greenwood/cli/src/plugins/resource/plugin-standard-css.js" {
  export const greenwoodPluginStandardCss: GreenwoodPlugin;
}

declare module "@greenwood/plugin-import-raw" {
  export function greenwoodPluginImportRaw(): Array<GreenwoodPlugin>;
}

declare module "@greenwood/cli/src/data/client.js" {
  export interface PageData {
    id: string;
    title: string;
    label: string;
    route: string;
    data: Record<string, unknown>;
  }
  export function getContent(): Promise<Array<PageData>>;
  export function getContentByRoute(route: string): Promise<Array<PageData>>;
  export function getContentByCollection(
    collection: string,
  ): Promise<Array<PageData>>;
}
