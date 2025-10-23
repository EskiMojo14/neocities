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
  import type { Config } from "@greenwood/cli";
  export function readAndMergeConfig(): Promise<Config>;
}

declare module "@greenwood/cli/src/lifecycles/context.js" {
  import type { Compilation, Config } from "@greenwood/cli";
  export function initContext(opts: {
    config: Config;
  }): Promise<Compilation["context"]>;
}

declare module "@greenwood/cli/src/data/client.js" {
  export interface Page {
    id: string;
    title: string;
    label: string;
    route: string;
    data: Record<string, unknown>;
  }
  export function getContent(): Promise<Array<Page>>;
  export function getContentByRoute(route: string): Promise<Array<Page>>;
  export function getContentByCollection(
    collection: string,
  ): Promise<Array<Page>>;
}

declare module "postcss-extend-rule" {
  import type { Plugin } from "postcss";
  type OnSyntax = "remove" | "ignore" | "warn" | "throw";
  interface Config {
    name?: string;
    onFunctionalSelector?: OnSyntax;
    onRecursiveExtend?: OnSyntax;
    onUnusedExtend?: OnSyntax;
  }
  export default function postcssExtendRule(config?: Config): Plugin;
}

declare module "postcss-import" {
  import type { Plugin } from "postcss";
  export default function postcssImport(): Plugin;
}
