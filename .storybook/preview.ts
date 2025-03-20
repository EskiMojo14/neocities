import { themes } from "@storybook/theming";
import type { Decorator, Preview } from "@storybook/web-components";
import * as v from "valibot";
import { themeSchema } from "../src/constants/prefs.ts";
import "../src/styles/global.css";

const dirSchema = v.picklist(["auto", "ltr", "rtl"]);

const rtlDecorator: Decorator = (
  story,
  { canvasElement, args: { dir, ...args } },
) => {
  canvasElement.dir = v.parse(dirSchema, dir);
  return story({ args });
};

const themeDecorator: Decorator = (story, { args: { theme, ...args } }) => {
  document.documentElement.dataset.theme = v.parse(themeSchema, theme);
  return story({ args });
};

const preview: Preview = {
  parameters: {
    layout: "centered",
    docs: {
      theme: window.matchMedia("(prefers-color-scheme: dark)").matches
        ? themes.dark
        : themes.light,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  argTypes: {
    dir: {
      control: "inline-radio",
      options: dirSchema.options,
    },
    theme: {
      control: "inline-radio",
      options: themeSchema.options,
    },
  },
  args: {
    dir: "auto",
    theme: themeSchema.fallback,
  },
  decorators: [rtlDecorator, themeDecorator],
};

export default preview;
