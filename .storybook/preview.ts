import { themes } from "@storybook/theming";
import type { Decorator, Preview } from "@storybook/web-components";
import * as v from "valibot";
import pages from "./mocks/graph.json";
import "../src/styles/global.css";

const dirSchema = v.picklist(["auto", "ltr", "rtl"]);

const rtlDecorator: Decorator = (
  story,
  { canvasElement, args: { dir, ...args } },
) => {
  canvasElement.dir = v.parse(dirSchema, dir);
  return story({ args });
};

const preview: Preview = {
  parameters: {
    layout: "centered",
    docs: {
      theme: themes.dark,
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
  },
  args: {
    dir: "auto",
  },
  decorators: [rtlDecorator],
};

export default preview;
