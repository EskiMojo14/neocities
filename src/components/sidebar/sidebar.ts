import {
  getContentByCollection,
  getContentByRoute,
} from "@greenwood/cli/src/data/client.js";
import { LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { html, type TemplateResult } from "lit-html";
import { ifDefined } from "lit-html/directives/if-defined.js";
import { repeat } from "lit-html/directives/repeat.js";
import { until } from "lit-html/directives/until.js";
import * as v from "valibot";
import base from "../../styles/base.css?type=raw";
import typography from "../../styles/typography.css?type=raw";
import type { WithOptional } from "../../utils/index.ts";
import { assert, uniqueBy } from "../../utils/index.ts";
import { isActiveLink, clsx, styleMap } from "../../utils/lit.ts";
import "../spinner/spinner.ts";
import sidebar from "./sidebar.css?type=raw";
import "./theme-toggle/theme-toggle.ts";

interface SidebarItemCommon {
  href: string;
  label: string;
  order?: number;
  published?: string;
  icon?: string;
}

interface SidebarItem extends SidebarItemCommon {
  type: "item";
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
    maxChildren?: number;
  };

const itemSchema = v.object({
  type: v.literal("item"),
  order: v.optional(v.number()),
  published: v.optional(v.string()),
  label: v.string(),
  href: v.string(),
  icon: v.optional(v.string()),
  childIcon: v.optional(v.string()),
  maxChildren: v.optional(v.number()),
}) satisfies v.GenericSchema<any, SidebarItem>;

async function getSidebarItems() {
  const base: Record<string, SidebarItem | SidebarGroup> = {};
  const content = await Promise.all([
    getContentByCollection("nav"),
    getContentByRoute("/blog/"),
    getContentByRoute("/packages/"),
  ]);
  for (const page of content
    .flat()
    .filter(uniqueBy((page) => page.route))
    .sort((a, b) => a.route.localeCompare(b.route))) {
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
      published: page.data.published,
      maxChildren: page.data.maxChildren,
    } satisfies Record<keyof v.InferInput<typeof itemSchema>, unknown>);
  }
  return base;
}

function renderSidebarItem(item: SidebarItem, currentRoute: string) {
  const isCurrent = isActiveLink(item.href, currentRoute, "equals");
  return html`<li>
    <a
      href=${item.href}
      tabindex=${isCurrent ? -1 : 0}
      class=${clsx("subtitle1", {
        current: isCurrent,
      })}
    >
      <material-symbol aria-hidden="true">${item.icon}</material-symbol>
      ${item.label}
    </a>
  </li>`;
}

const isNumber = (value: unknown) => typeof value === "number";

function orderSort(a: { order?: number }, b: { order?: number }) {
  if (isNumber(a.order) && isNumber(b.order)) {
    return a.order - b.order;
  }
  if (a.order || b.order) {
    return a.order ? -1 : 1;
  }
  return undefined;
}

function publishedSort(a: { published?: string }, b: { published?: string }) {
  if (a.published && b.published) {
    return a.published < b.published ? -1 : a.published > b.published ? 1 : 0;
  }
  if (a.published || b.published) {
    return a.published ? -1 : 1;
  }
  return undefined;
}

const sortSidebarItems = (
  a: SidebarItem | SidebarGroup,
  b: SidebarItem | SidebarGroup,
): number =>
  orderSort(a, b) ?? publishedSort(a, b) ?? a.label.localeCompare(b.label);

function renderSidebarGroup(
  group: SidebarGroup,
  currentRoute: string,
  level: number,
) {
  let children = Object.values(group.children).sort(sortSidebarItems);
  if (group.maxChildren && children.length > group.maxChildren) {
    children = children.slice(0, group.maxChildren);
    children.push({
      type: "item",
      label: "More",
      href: group.href,
      icon: "more_horiz",
      order: 0,
    });
  }
  const isCurrent = isActiveLink(group.href, currentRoute, "equals");
  return html`<li
    class=${clsx("group", {
      parent: isActiveLink(group.href, currentRoute, "includes"),
    })}
  >
    <a
      href=${ifDefined(group.href)}
      tabindex=${isCurrent ? -1 : 0}
      class=${clsx("subtitle1", {
        current: isCurrent,
      })}
    >
      <material-symbol aria-hidden="true">${group.icon}</material-symbol>
      ${group.label}</a
    >
    <ul style=${styleMap({ "--level": level })}>
      ${repeat(
        children,
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
  static styles = [unsafeCSS(base), unsafeCSS(typography), unsafeCSS(sidebar)];

  @property({ type: String, attribute: "current-route" })
  currentRoute = "/";

  #_sidebarItems: Record<string, SidebarItem | SidebarGroup> | undefined;
  async #getSidebarItems() {
    return (this.#_sidebarItems ??= await getSidebarItems());
  }

  render() {
    return html`
      <nav>
        <div class="header-row">
          <h1 class="headline6">eskimojo</h1>
          <theme-toggle></theme-toggle>
        </div>
        <ul>
          ${until(
            this.#getSidebarItems().then((sidebarItems) =>
              repeat(
                Object.values(sidebarItems).sort(sortSidebarItems),
                (item) => item.href,
                (item) =>
                  item.type === "item"
                    ? renderSidebarItem(item, this.currentRoute)
                    : renderSidebarGroup(item, this.currentRoute, 1),
              ),
            ),
            html`<hourglass-spinner></hourglass-spinner>`,
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
