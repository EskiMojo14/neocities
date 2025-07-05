import type { ResourcePlugin } from "@greenwood/cli";

const envRegex = /(?:import\.meta\.env|process\.env)\.([A-Z_]+)/g;

export const envPlugin = (): ResourcePlugin => {
  return {
    type: "resource",
    name: "eskimojo-plugin-env",
    provider: () => {
      return {
        async shouldIntercept(url, _request, response) {
          return (
            !url.href.endsWith("src/greenwood/env.ts") &&
            envRegex.test(await response.text())
          );
        },
        async intercept(_url, request, response) {
          const body = await response.text();
          const env =
            process.env.__GWD_COMMAND__ === "develop"
              ? "development"
              : "production";
          const replaced = body.replace(envRegex, (_match, name: string) => {
            if (name === "NODE_ENV") return `"${env}"`;
            const value = process.env[name];
            if (value === undefined) {
              console.warn(`Missing env variable: ${name} in ${request.url}`);
            }
            return value ? `"${value}"` : "undefined";
          });
          return new Response(replaced);
        },
      };
    },
  };
};
