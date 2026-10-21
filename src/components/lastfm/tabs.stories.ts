import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import "./tabs.ts";

const meta = {
  title: "Components/LastFM/Tabs",
  tags: ["autodocs"],
  component: "lastfm-tabs",
  render: () => html`<lastfm-tabs></lastfm-tabs>`,
} satisfies Meta<HTMLElementTagNameMap["lastfm-tabs"]>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
