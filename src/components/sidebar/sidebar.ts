import { LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { html } from "lit-html";
import { ifDefined } from "lit-html/directives/if-defined.js";
import { map } from "lit-html/directives/map.js";
import type { WithOptional } from "../../utils/index.ts";
import { isActiveLink, clsx } from "../../utils/lit.ts";
import "../symbol/symbol.ts";
import sidebar from "./sidebar.css" with { type: "css" };
import base from "../../styles/base.css" with { type: "css" };
import typography from "../../styles/typography.css" with { type: "css" };

interface SidebarItem {
  type?: "item";
  label: string;
  href: string;
  icon: string;
}

type GroupIconUnion =
  | {
      childIcon: string;
      items: Array<WithOptional<SidebarItem, "icon">>;
    }
  | {
      childIcon?: never;
      items: Array<SidebarItem>;
    };

type SidebarGroup = GroupIconUnion & {
  type: "group";
  label: string;
  href?: string;
  icon: string;
};

const sidebarItems: Array<SidebarItem | SidebarGroup> = [
  {
    label: "Home",
    href: "/",
    icon: "home",
  },
  {
    label: "About",
    href: "/about/",
    icon: "info",
  },
  {
    label: "Blog",
    href: "/blog/",
    type: "group",
    icon: "newsmode",
    childIcon: "article",
    items: [
      {
        label: "Post 1",
        href: "/blog/post-1/",
      },
      {
        label: "Post 2",
        href: "/blog/post-2/",
      },
    ],
  },
];

@customElement("sidebar-nav")
export default class Sidebar extends LitElement {
  static styles = [base, typography, sidebar];

  @property({ type: String, attribute: "current-route" })
  currentRoute = "/";

  render() {
    return html`
      <nav>
        <ul>
          ${map(sidebarItems, (item) => {
            if (item.type === "group") {
              return html`
                <li class="group">
                  <a
                    href=${ifDefined(item.href)}
                    class=${clsx("subtitle1", {
                      current: isActiveLink(item.href, this.currentRoute),
                    })}
                  >
                    <material-symbol>${item.icon}</material-symbol>
                    ${item.label}
                  </a>
                  <ul>
                    ${map(
                      item.items,
                      (subItem) => html`
                        <li>
                          <a
                            href=${subItem.href}
                            class=${clsx("subtitle2", {
                              current: isActiveLink(
                                subItem.href,
                                this.currentRoute,
                              ),
                            })}
                          >
                            <material-symbol>
                              ${subItem.icon ?? item.childIcon}
                            </material-symbol>
                            ${subItem.label}
                          </a>
                        </li>
                      `,
                    )}
                  </ul>
                </li>
              `;
            } else {
              return html`
                <li>
                  <a
                    href=${item.href}
                    class=${clsx("subtitle1", {
                      current: isActiveLink(item.href, this.currentRoute),
                    })}
                  >
                    <material-symbol>${item.icon}</material-symbol>
                    ${item.label}
                  </a>
                </li>
              `;
            }
          })}
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
