import type { Meta, StoryObj } from "@storybook/web-components";
import "./spinner.ts";

const meta = {
  title: "Components/Spinner",
  tags: ["autodocs"],
  component: "hourglass-spinner",
} satisfies Meta<HTMLElementTagNameMap["hourglass-spinner"]>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
