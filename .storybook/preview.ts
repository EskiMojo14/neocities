import type { Decorator, Preview } from "@storybook/web-components";
import "../src/style.scss";
import { parse, picklist } from "valibot";

const dirSchema = picklist(["auto", "ltr", "rtl"]);

const rtlDecorator: Decorator = (
  story,
  { canvasElement, args: { dir, ...args } }
) => {
  canvasElement.dir = parse(dirSchema, dir);
  return story({ args });
};

const preview: Preview = {
  parameters: {
    layout: "centered",
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
  },
  args: {
    dir: "auto",
  },
  decorators: [rtlDecorator],
};

export default preview;
