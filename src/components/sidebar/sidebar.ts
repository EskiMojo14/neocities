import { LitElement, css } from "lit";
import { customElement } from "lit/decorators.js";
import { html } from "lit-html";
import { classMap } from "lit-html/directives/class-map.js";
import { selectors, isActiveLink } from "/utils/lit.ts";
import "/components/symbol/symbol.ts";

interface SidebarItem {
  type?: "item";
  label: string;
  href: string;
  icon?: string;
}

interface SidebarGroup {
  type: "group";
  label: string;
  items: Array<SidebarItem>;
  href?: string;
  icon?: string;
  childIcon?: string;
}

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
export class Sidebar extends LitElement {
  static styles = css`
    a {
      color: var(--link);
      &:visited {
        color: var(--link-visited);
      }
      &.active {
        font-weight: bold;
      }
    }
    nav {
      --padding: 1rem;
      padding: var(--padding);
      padding-left: 0;
      border-right: 1px solid var(--foreground);
      ${selectors.rtl} {
        padding-left: var(--padding);
        padding-right: 0;
        border-left: 1px solid var(--foreground);
        border-right: none;
      }
    }
    ul {
      display: flex;
      flex-direction: column;
      list-style: none;
      gap: 0.5rem;
      ul {
        padding-left: var(--padding);
        ${selectors.rtl} {
          padding-right: var(--padding);
          padding-left: 0;
        }
      }
    }
    li {
      list-style: none;
      display: flex;
      align-items: center;
      &.group {
        flex-direction: column;
      }
    }
  `;

  render() {
    return html`
      <nav>
        <ul>
          ${sidebarItems.map((item) => {
            if (item.type === "group") {
              return html`
                <li class="group">
                  <material-symbol>${item.icon}</material-symbol>
                  ${item.href
                    ? html`<a
                        href=${item.href}
                        class=${classMap({ active: isActiveLink(item.href) })}
                        >${item.label}</a
                      >`
                    : item.label}
                  <ul>
                    ${item.items.map(
                      (subItem) => html`
                        <li>
                          <material-symbol
                            >${subItem.icon ?? item.childIcon}</material-symbol
                          >
                          <a
                            href=${subItem.href}
                            class=${classMap({
                              active: isActiveLink(subItem.href),
                            })}
                            >${subItem.label}</a
                          >
                        </li>
                      `
                    )}
                  </ul>
                </li>
              `;
            } else {
              return html`
                <li>
                  <material-symbol>${item.icon}</material-symbol>
                  <a
                    href=${item.href}
                    class=${classMap({ active: isActiveLink(item.href) })}
                    >${item.label}</a
                  >
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
