import { LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { html, type TemplateResult } from "lit-html";
import { ifDefined } from "lit-html/directives/if-defined.js";
import { repeat } from "lit-html/directives/repeat.js";
import type { WithOptional } from "../../utils/index.ts";
import { isActiveLink, clsx } from "../../utils/lit.ts";
import "../symbol/symbol.ts";
import sidebar from "./sidebar.css" with { type: "css" };
import base from "../../styles/base.css" with { type: "css" };
import typography from "../../styles/typography.css" with { type: "css" };

interface SidebarItem {
  type: "item";
  label: string;
  href: string;
  icon: string;
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

type SidebarGroup = GroupIconUnion & {
  type: "group";
  label: string;
  href?: string;
  icon: string;
};

const sidebarItems: Record<string, SidebarItem | SidebarGroup> = {
  "/": {
    type: "item",
    label: "Home",
    href: "/",
    icon: "home",
  },
  "/about": {
    type: "item",
    label: "About",
    href: "/about/",
    icon: "info",
  },
  "/blog": {
    type: "group",
    label: "Blog",
    href: "/blog/",
    icon: "newsmode",
    childIcon: "article",
    children: {
      "/post-1": {
        type: "item",
        label: "Post 1",
        href: "/blog/post-1/",
      },
      "/post-2": {
        type: "item",
        label: "Post 2",
        href: "/blog/post-2/",
      },
    },
  },
};

function renderSidebarItem(item: SidebarItem, currentRoute: string) {
  return html`<li>
    <a
      href=${item.href}
      class=${clsx("subtitle1", {
        current: isActiveLink(item.href, currentRoute),
      })}
    >
      <material-symbol>${item.icon}</material-symbol>
      ${item.label}
    </a>
  </li>`;
}

function renderSidebarGroup(group: SidebarGroup, currentRoute: string) {
  return html`<li class="group">
    <a
      href=${ifDefined(group.href)}
      class=${clsx("subtitle1", {
        current: isActiveLink(group.href, currentRoute),
      })}
    >
      <material-symbol>${group.icon}</material-symbol>
      ${group.label}</a
    >
    <ul>
      ${repeat(
        Object.values(group.children),
        (item) => item.href,
        (item): TemplateResult<1> =>
          item.type === "item"
            ? renderSidebarItem(
                { ...item, icon: item.icon ?? group.childIcon ?? "" },
                currentRoute,
              )
            : renderSidebarGroup(item, currentRoute),
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
            Object.values(sidebarItems),
            (item) => item.href,
            (item) =>
              item.type === "item"
                ? renderSidebarItem(item, this.currentRoute)
                : renderSidebarGroup(item, this.currentRoute),
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
