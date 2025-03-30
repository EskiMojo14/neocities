import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { styleMap } from "../../utils/lit.ts";
import "./carousel.ts";

const meta = {
  title: "Components/Carousel",
  tags: ["autodocs"],
  component: "img-carousel",
  render: ({ items, fit, aspectRatio, size }) =>
    html`<img-carousel
      .items=${items}
      style=${styleMap({
        "--carousel-fit": fit,
        "--carousel-w": aspectRatio[0],
        "--carousel-h": aspectRatio[1],
        "--carousel-base-size": `${size}px`,
      })}
    ></img-carousel>`,
  args: {
    items: [
      { src: "https://picsum.photos/500", aspectRatio: [1, 1] },
      { src: "https://picsum.photos/1000/500", aspectRatio: [2, 1] },
      { src: "https://picsum.photos/500/1000", aspectRatio: [1, 2] },
    ],
    size: 300,
    fit: "contain",
    aspectRatio: [1, 1],
  },
  argTypes: {
    fit: {
      control: "inline-radio",
      options: ["contain", "cover"],
    },
    aspectRatio: {
      control: "inline-radio",
      options: ["1 / 1", "16 / 9", "4 / 3", "3 / 4", "9 / 16"],
      mapping: {
        "1 / 1": [1, 1],
        "16 / 9": [16, 9],
        "4 / 3": [4, 3],
        "3 / 4": [3, 4],
        "9 / 16": [9, 16],
      },
    },
  },
} satisfies Meta<
  HTMLElementTagNameMap["img-carousel"] & {
    fit: string;
    aspectRatio: [number, number];
    size: number;
  }
>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
