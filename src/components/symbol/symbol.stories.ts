import type { StoryObj, Meta } from "@storybook/web-components";
import { html } from "lit-html";
import { styleMap } from "../../utils/lit.ts";
import "./symbol.ts";

const meta = {
  title: "Material Symbol",
  tags: ["autodocs"],
  component: "material-symbol",
  render: ({
    children,
    size,
    fill,
    weight,
    grade,
    opticalSize,
    flipRtl,
  }) => html`
    <material-symbol
      aria-hidden="true"
      ?flip-rtl=${flipRtl}
      style=${styleMap({
        "--icon-size": `${size}px`,
        "--icon-fill": fill ? 1 : 0,
        "--icon-weight": weight,
        "--icon-grade": grade,
        "--icon-optical-size": opticalSize ?? size,
      })}
    >
      ${children}
    </material-symbol>
  `,
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
    children: "edit",
    size: 24,
    fill: false,
    weight: 400,
    grade: -25,
    opticalSize: undefined,
    flipRtl: false,
  },
} satisfies Meta<{
  children: string;
  size: number;
  fill: boolean;
  weight: number;
  grade: number;
  opticalSize?: number;
  flipRtl: boolean;
}>;
export default meta;

type Story = StoryObj;

export const Default: Story = {};
