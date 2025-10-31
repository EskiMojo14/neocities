import type { Decorator, Preview } from "@storybook/web-components-vite";
import { http, HttpResponse } from "msw";
import { initialize, mswLoader } from "msw-storybook-addon";
import { themes } from "storybook/theming";
import * as v from "valibot";
import { stylePref, themePref } from "../src/constants/prefs.ts";
import pages from "../src/mocks/graph.json";
import "../src/styles/global.css";

const ignorePatterns = [
  /\/src\//,
  /fonts\.googleapis\.com/,
  /lastfm\.freetls\.fastly\.net/,
];

initialize(
  {
    onUnhandledRequest(req, print) {
      if (!ignorePatterns.some((pattern) => pattern.test(req.url))) {
        print.warning();
      }
    },
  },
  [
    http.get(/localhost:\d+\/___graph.json/, () => HttpResponse.json(pages)),
    // redirect assets folder to root
    http.get(/localhost:\d+\/assets/, ({ request }) =>
      fetch(request.url.replace("/assets", "")),
    ),
  ],
);

const dirSchema = v.fallback(v.picklist(["auto", "ltr", "rtl"]), "auto");

const rtlDecorator: Decorator = (
  story,
  { canvasElement, args: { dir, ...args } },
) => {
  canvasElement.dir = v.parse(dirSchema, dir);
  return story({ args });
};

const themeDecorator: Decorator = (story, { args: { theme, ...args } }) => {
  themePref.data = themePref.parser(theme);
  return story({ args });
};

const styleDecorator: Decorator = (story, { args: { style, ...args } }) => {
  stylePref.data = stylePref.parser(style);
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
      options: themePref.options,
    },
    style: {
      control: "inline-radio",
      options: stylePref.options,
    },
  },
  args: {
    dir: dirSchema.fallback,
    theme: themePref.fallback,
    style: stylePref.fallback,
  },
  decorators: [rtlDecorator, themeDecorator, styleDecorator],
  loaders: [mswLoader],
};

export default preview;
