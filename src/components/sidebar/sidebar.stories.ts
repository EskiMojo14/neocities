import type { Meta, StoryObj } from "@storybook/web-components";
import pages from "../../../.storybook/mocks/graph.json";
import "./sidebar.ts";

const meta = {
  title: "Sidebar",
  tags: ["autodocs"],
  component: "sidebar-nav",
  parameters: {
    fetchMock: {
      mocks: [
        {
          matcher: {
            url: "http://localhost:1984/___graph.json",
            response: {
              body: pages,
            },
          },
        },
      ],
    },
  },
} satisfies Meta<HTMLElementTagNameMap["sidebar-nav"]>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
