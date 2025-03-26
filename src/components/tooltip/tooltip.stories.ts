import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { styleMap } from "../../utils/lit.ts";
import Tooltip from "./tooltip.ts";

const meta = {
  title: "Tooltip",
  tags: ["autodocs"],
  component: "tool-tip",
  render: () => html`
    <div style=${styleMap({ display: "flex", gap: "1rem" })}>
      <button
        ${ref((button) => {
          if (button) Tooltip.lazy(button, "lazy tooltip");
        })}
      >
        hover me
      </button>
      <button
        ${ref((button) => {
          if (button) Tooltip.lazy(button, "for tooltip");
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
