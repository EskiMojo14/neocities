import type { StoryObj, Meta } from "@storybook/web-components";
import "./symbol.ts";

const meta = {
  title: "Material Symbol",
  tags: ["autodocs"],
  component: "material-symbol",
  argTypes: {
    weight: {
      control: {
        type: "range",
        min: 100,
        max: 700,
        step: 100,
      },
    },
    grade: {
      control: {
        type: "range",
        min: -25,
        max: 200,
      },
    },
    size: {
      control: {
        type: "range",
        min: 20,
        max: 48,
      },
    },
    opticalSize: {
      control: {
        type: "range",
        min: 20,
        max: 48,
      },
    },
    fill: {
      control: "boolean",
    },
    flipRtl: {
      control: "boolean",
    },
  },
  args: {
    innerText: "edit",
    size: 24,
    fill: false,
    weight: 400,
    grade: -25,
    opticalSize: undefined,
    flipRtl: false,
  },
} satisfies Meta<HTMLElementTagNameMap["material-symbol"]>;
export default meta;

type Story = StoryObj;

export const Default: Story = {};
