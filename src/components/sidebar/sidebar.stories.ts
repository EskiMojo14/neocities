import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { useArgs, useGlobals } from "storybook/preview-api";
import "../../scripts/page-scroll.ts";
import "./sidebar.ts";
import type { ThemeChangeEvent } from "./theme-toggle/theme-toggle.ts";

const meta = {
  title: "Components/Sidebar",
  tags: ["autodocs"],
  component: "sidebar-nav",
  render() {
    const [args] = useArgs();
    const [, setGlobals] = useGlobals();
    return html`<sidebar-nav
      @themechange=${(e: ThemeChangeEvent) => {
        setGlobals({ theme: e.newTheme });
      }}
      current-route=${args.currentRoute}
    ></sidebar-nav>`;
  },
} satisfies Meta<HTMLElementTagNameMap["sidebar-nav"]>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
