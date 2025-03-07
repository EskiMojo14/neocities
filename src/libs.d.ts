declare module "*.module.css" {
  const classes: Readonly<Record<string, string>>;
  export default classes;
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

declare module "@greenwood/cli/src/plugins/resource/plugin-standard-css.js" {
  import type { UserConfig } from "vite";

  export const greenwoodPluginStandardCss: {
    provider: (compilation: {
      context: GreenwoodContext;
      config: UserConfig;
    }) => {
      intercept: (
        url: URL,
        request: Request,
        response: Response,
      ) => Promise<Response>;
    };
  };
}
