import type { Page } from "@greenwood/cli";
import {
  getContentByCollection,
  getContentByRoute,
} from "@greenwood/cli/src/data/client.js";
import type { TemplateResult } from "lit";
import { html, LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { repeat } from "lit/directives/repeat.js";
import * as v from "valibot";
import base from "../../styles/utility/baseline.css?type=raw";
import type { WithOptional } from "../../utils/index.ts";
import { assert, uniqueBy } from "../../utils/index.ts";
import { clsx, isActiveLink, styleMap } from "../../utils/lit.ts";
import "../spinner/spinner.ts";
import sidebar from "./sidebar.css?type=raw";
import "./theme-toggle/theme-toggle.ts";

const logo = html`<svg
  viewBox="0 0 24 24"
  version="1.1"
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  xml:space="preserve"
  xmlns:serif="http://www.serif.com/"
  style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"
>
  <path
    d="M6.615,10.032L5.55,9.43L3.22,10.05L2.7,8.12L4.47,7.65L4,5.88L5.92,5.36L6.5,7.69L8.07,8.577L6.615,10.032Z"
    style="fill:var(--logo6);"
  />
  <path
    d="M8.088,15.441L6.55,16.31L5.93,18.64L4,18.12L4.47,16.36L2.7,15.89L3.22,13.96L5.55,14.58L6.622,13.974L8.088,15.441Z"
    style="fill:var(--logo5);"
  />
  <path
    d="M13,17L13,18.88L14.71,20.59L13.29,22L12,20.71L10.71,22L9.29,20.59L11,18.88L11,17L13,17Z"
    style="fill:var(--logo4);"
  />
  <path
    d="M17.385,13.968L18.45,14.57L20.78,13.95L21.3,15.88L19.53,16.35L20,18.12L18.08,18.64L17.5,16.31L15.93,15.423L17.385,13.968Z"
    style="fill:var(--logo3);"
  />
  <path
    d="M15.912,8.559L17.45,7.69L18.07,5.36L20,5.88L19.53,7.64L21.3,8.11L20.78,10.04L18.45,9.42L17.378,10.026L15.912,8.559Z"
    style="fill:var(--logo2);"
  />
  <path
    d="M11,7L11,5.12L9.29,3.41L10.71,2L12,3.29L13.29,2L14.71,3.41L13,5.12L13,7L11,7Z"
    style="fill:var(--logo1);"
  />
  <g transform="matrix(0.025,0,0,0.025,-5,17)">
    <path
      d="M584,-56L440,-200L584,-344L640,-287L553,-200L640,-113L584,-56ZM776,-56L720,-113L807,-200L720,-287L776,-344L920,-200L776,-56Z"
      style="fill:var(--foreground);fill-rule:nonzero;"
    />
  </g>
</svg>`;

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
  published: v.optional(v.pipe(v.string(), v.isoTimestamp())),
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
  const uniqueByRoute = uniqueBy((page: Page) => page.route);
  for (const page of content
    .flat()
    .filter(
      (page) => uniqueByRoute(page) && page.route.split("/")[2] !== "tags",
    )
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
    try {
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
    } catch (error) {
      console.error(
        `failed to parse sidebar item: ${page.route}`,
        error instanceof v.ValiError && error.issues,
      );
    }
  }
  return base;
}

const sidebarItems = await getSidebarItems();

function renderSidebarItem(item: SidebarItem, currentRoute: string) {
  return html`<li>
    <a
      href=${item.href}
      class=${clsx({
        current: isActiveLink(item.href, currentRoute, "equals"),
      })}
    >
      <material-symbol aria-hidden="true" title=${item.label}
        >${item.icon}</material-symbol
      >
      <span class="subtitle1">${item.label}</span>
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
    return b.published.localeCompare(a.published);
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
  return html`<li
    class=${clsx("group", {
      parent: isActiveLink(group.href, currentRoute, "includes"),
    })}
  >
    <a
      href=${ifDefined(group.href)}
      class=${clsx({
        current: isActiveLink(group.href, currentRoute, "equals"),
      })}
    >
      <material-symbol aria-hidden="true" title=${group.label}
        >${group.icon}</material-symbol
      >
      <span class="subtitle1">${group.label}</span></a
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
  static styles = [unsafeCSS(base), unsafeCSS(sidebar)];

  @property({ type: String, attribute: "current-route" })
  currentRoute = "/";

  scrollAc: AbortController | undefined;

  #handleScroll() {
    const scrolled = window.scrollY > 0;
    if (scrolled) {
      this.dataset.scrolled = "true";
    } else {
      delete this.dataset.scrolled;
    }
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("scroll", this.#handleScroll.bind(this), {
      signal: (this.scrollAc = new AbortController()).signal,
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.scrollAc?.abort();
  }

  render() {
    return html`
      <nav>
        <div class="header-row">
          <h1 class="headline6">${logo}eskimojo</h1>
          <theme-toggle></theme-toggle>
        </div>
        <ul>
          ${repeat(
            Object.values(sidebarItems).sort(sortSidebarItems),
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
