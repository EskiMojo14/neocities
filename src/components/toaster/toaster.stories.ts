import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import * as v from "valibot";
import { objectKeys } from "../../utils/index.ts";
import * as vUtils from "../../utils/valibot.ts";
import { toast, typeIcons } from "./toaster.ts";

const formSchema = vUtils.formDataShape({
  type: v.picklist(objectKeys(typeIcons)),
  message: v.string(),
  timeout: vUtils.coerceNumber,
});

const meta = {
  title: "Toast",
  tags: ["autodocs"],
  component: "toast-queue",
  render: () => html`
    <toast-queue></toast-queue>
    <form
      @submit=${(e: SubmitEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const parsed = v.parse(formSchema, formData);
        toast(parsed.type, parsed.message, parsed.timeout);
      }}
    >
      <select name="type" value="info">
        <option value="info">Info</option>
        <option value="success">Success</option>
        <option value="warning">Warning</option>
        <option value="error">Error</option>
      </select>
      <input name="message" type="text" value="message" />
      <input type="number" name="timeout" min="0" step="1000" value="0" />
      <button type="submit">Submit</button>
    </form>
  `,
} satisfies Meta<HTMLElementTagNameMap["toast-queue"]>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
