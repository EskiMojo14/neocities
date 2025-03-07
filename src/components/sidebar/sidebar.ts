import {
  getContentByCollection,
  getContentByRoute,
} from "@greenwood/cli/src/data/client.js";
import { LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { html, type TemplateResult } from "lit-html";
import { ifDefined } from "lit-html/directives/if-defined.js";
import { repeat } from "lit-html/directives/repeat.js";
import * as v from "valibot";
import type { WithOptional } from "../../utils/index.ts";
import { assert } from "../../utils/index.ts";
import { isActiveLink, clsx, styleMap } from "../../utils/lit.ts";
import "../symbol/symbol.ts";
import sidebar from "./sidebar.css" with { type: "css" };
import base from "../../styles/base.css" with { type: "css" };
import typography from "../../styles/typography.css" with { type: "css" };

interface SidebarItemCommon {
  label: string;
  order: number;
  icon?: string;
}

interface SidebarItem extends SidebarItemCommon {
  type: "item";
  href: string;
}

type GroupIconUnion =
  | {
      childIcon: string;
      children: Record<
        string,
        WithOptional<SidebarItem, "icon"> | SidebarGroup
      >;
    }
  | {
      childIcon?: never;
      children: Record<string, SidebarItem | SidebarGroup>;
    };

type SidebarGroup = GroupIconUnion &
  SidebarItemCommon & {
    type: "group";
    href?: string;
  };

const itemSchema = v.object({
  type: v.literal("item"),
  order: v.optional(v.number(), 0),
  label: v.string(),
  href: v.string(),
  icon: v.optional(v.string()),
  childIcon: v.optional(v.string()),
}) satisfies v.GenericSchema<any, SidebarItem>;

async function getSidebarItems() {
  const base: Record<string, SidebarItem | SidebarGroup> = {};
  const [content, blogPosts] = await Promise.all([
    getContentByCollection("nav"),
    getContentByRoute("/blog/"),
  ]);
  for (const page of content.concat(blogPosts)) {
    const paths = page.route.split("/").filter(Boolean);
    let cursor = base;
    const last = paths.pop() ?? "";
    for (const path of paths) {
      const wrapped = `/${path}/`;
      let current = cursor[wrapped];
      assert(current, `Path ${path} not found in sidebar`);
      if (current.type === "item") {
        cursor[wrapped] = current = {
          ...current,
          type: "group",
          children: {},
        } satisfies SidebarGroup;
      }
      cursor = current.children as never;
    }
    cursor[last ? `/${last}/` : "/"] = v.parse(itemSchema, {
      type: "item",
      label: page.label,
      href: page.route,
      icon: page.data.icon,
      childIcon: page.data.childIcon,
      order: page.data.order,
    } satisfies Record<keyof v.InferInput<typeof itemSchema>, unknown>);
  }
  return base;
}

const sidebarItems = await getSidebarItems();

function renderSidebarItem(item: SidebarItem, currentRoute: string) {
  return html`<li>
    <a
      href=${item.href}
      class=${clsx("subtitle1", {
        current: isActiveLink(item.href, currentRoute, "equals"),
      })}
    >
      <material-symbol>${item.icon}</material-symbol>
      ${item.label}
    </a>
  </li>`;
}

function renderSidebarGroup(
  group: SidebarGroup,
  currentRoute: string,
  level: number,
) {
  return html`<li
    class=${clsx("group", {
      parent: isActiveLink(group.href, currentRoute, "includes"),
    })}
  >
    <a
      href=${ifDefined(group.href)}
      class=${clsx("subtitle1", {
        current: isActiveLink(group.href, currentRoute, "equals"),
      })}
    >
      <material-symbol>${group.icon}</material-symbol>
      ${group.label}</a
    >
    <ul style=${styleMap({ "--level": level })}>
      ${repeat(
        Object.values(group.children).sort((a, b) => a.order - b.order),
        (item) => item.href,
        (item): TemplateResult<1> =>
          item.type === "item"
            ? renderSidebarItem(
                { ...item, icon: item.icon ?? group.childIcon ?? "" },
                currentRoute,
              )
            : renderSidebarGroup(item, currentRoute, level + 1),
      )}
    </ul>
  </li>`;
}

@customElement("sidebar-nav")
export default class Sidebar extends LitElement {
  static styles = [base, typography, sidebar];

  @property({ type: String, attribute: "current-route" })
  currentRoute = "/";

  render() {
    return html`
      <nav>
        <ul>
          ${repeat(
            Object.values(sidebarItems).sort((a, b) => a.order - b.order),
            (item) => item.href,
            (item) =>
              item.type === "item"
                ? renderSidebarItem(item, this.currentRoute)
                : renderSidebarGroup(item, this.currentRoute, 1),
          )}
        </ul>
      </nav>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sidebar-nav": Sidebar;
  }
}
