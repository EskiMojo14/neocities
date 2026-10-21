import type { Decorator, Preview } from "@storybook/web-components-vite";
import { http, HttpResponse } from "msw";
import { initialize, mswLoader } from "msw-storybook-addon";
import { html } from "lit";
import { themes } from "storybook/theming";
import * as v from "valibot";
import { stylePref, themePref } from "../src/constants/prefs.ts";
import pages from "../src/mocks/graph.json";
import "../src/styles/global.css";
import "../src/components/providers/app-query.ts";
import "../src/components/providers/prefs.ts";

const ignorePatterns = [/\/src\//, /fonts\.googleapis\.com/, /lastfm\.freetls\.fastly\.net/];

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
    http.get(/localhost:\d+\/assets/, ({ request }) => fetch(request.url.replace("/assets", ""))),
  ],
);

const dirSchema = v.fallback(v.picklist(["auto", "ltr", "rtl"]), "auto");

const rtlDecorator: Decorator = (story, { canvasElement, globals: { dir } }) => {
  canvasElement.dir = v.parse(dirSchema, dir);
  return story();
};

const providersDecorator: Decorator = (story, { globals: { theme, style } }) => {
  themePref.data = themePref.parser(theme);
  stylePref.data = stylePref.parser(style);
  return html`
    <app-query-provider>
      <prefs-provider .theme=${themePref.data} .pageStyle=${stylePref.data}>
        ${story()}
      </prefs-provider>
    </app-query-provider>
  `;
};

const preview: Preview = {
  parameters: {
    layout: "centered",
    docs: {
      theme: window.matchMedia("(prefers-color-scheme: dark)").matches ? themes.dark : themes.light,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  globalTypes: {
    dir: {
      description: "Text direction",
      toolbar: {
        icon: "paragraph",
        items: dirSchema.options,
        dynamicTitle: true,
      },
    },
    theme: {
      description: "Page theme",
      toolbar: {
        icon: "circlehollow",
        items: themePref.options,
        dynamicTitle: true,
      },
    },
    style: {
      description: "Page style",
      toolbar: {
        icon: "paintbrush",
        items: stylePref.options,
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    dir: dirSchema.fallback,
    theme: themePref.fallback,
    style: stylePref.fallback,
  },
  decorators: [rtlDecorator, providersDecorator],
  loaders: [mswLoader],
};

export default preview;
