import { addons } from "@storybook/manager-api";
import { themes } from "@storybook/theming";

addons.setConfig({
  theme: window.matchMedia("(prefers-color-scheme: dark)").matches
    ? themes.dark
    : themes.light,
});
