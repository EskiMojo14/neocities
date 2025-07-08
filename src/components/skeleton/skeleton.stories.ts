import type { Meta, StoryObj } from "@storybook/web-components";
import "./skeleton.ts";

const meta = {
  title: "Components/Skeleton",
  tags: ["autodocs"],
  component: "text-skeleton",
  args: {
    textContent: "skeleton",
    className: "body2",
  },
  argTypes: {
    className: {
      control: "select",
      options: [
        "headline1",
        "headline2",
        "headline3",
        "headline4",
        "headline5",
        "headline6",
        "body1",
        "body2",
        "subtitle1",
        "subtitle2",
        "button",
        "overline",
        "caption",
      ],
    },
  },
} satisfies Meta<HTMLElementTagNameMap["text-skeleton"]>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
