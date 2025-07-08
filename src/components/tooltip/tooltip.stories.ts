import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { styleMap } from "../../utils/lit.ts";
import Tooltip from "./tooltip.ts";

const meta = {
  title: "Components/Tooltip",
  tags: ["autodocs"],
  component: "tool-tip",
  render: () => html`
    <div style=${styleMap({ display: "flex", gap: "1rem" })}>
      <button
        ${ref((button) => {
          if (button) Tooltip.lazy(button, { text: "lazy tooltip 1" });
        })}
      >
        hover me
      </button>
      <button
        ${ref((button) => {
          if (button) Tooltip.lazy(button, { text: "lazy tooltip 2" });
        })}
      >
        then me
      </button>
    </div>
  `,
} satisfies Meta<HTMLElementTagNameMap["tool-tip"]>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
