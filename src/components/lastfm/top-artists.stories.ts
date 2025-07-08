import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import "./top-artists.ts";

const meta = {
  title: "Components/LastFM/Top Artists",
  tags: ["autodocs"],
  component: "top-artists",
  render: () => html`<top-artists></top-artists>`,
} satisfies Meta<HTMLElementTagNameMap["top-artists"]>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
