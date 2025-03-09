import type { StorybookConfig } from "@storybook/web-components-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-essentials", "storybook-addon-fetch-mock"],
  framework: {
    name: "@storybook/web-components-vite",
    options: {},
  },
};
export default config;
