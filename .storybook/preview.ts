import { themes } from "@storybook/theming";
import type { Decorator, Preview } from "@storybook/web-components";
import * as v from "valibot";
import { dirSchema, themeSchema } from "../src/constants/prefs.ts";
import pages from "./mocks/graph.json";
import "../src/styles/global.css";

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
    fetchMock: {
      mocks: [
        {
          matcher: {
            url: "http://localhost:1984/___graph.json",
            response: {
              body: pages,
            },
          },
        },
      ],
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
    dir: dirSchema.fallback,
    theme: themeSchema.fallback,
  },
  decorators: [rtlDecorator, themeDecorator],
};

export default preview;
