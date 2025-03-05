import { LitElement, css } from "lit";
import { customElement } from "lit/decorators.js";
import { html } from "lit-html";
import { classMap } from "lit-html/directives/class-map.js";
import { ifDefined } from "lit-html/directives/if-defined.js";
import { map } from "lit-html/directives/map.js";
import { selectors, isActiveLink } from "../../utils/lit.ts";
import "../symbol/symbol.ts";

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
    nav {
      --padding-h: 2rem;
      --padding-v: 1rem;
      padding: var(--padding-v) var(--padding-h);
      padding-left: 0;
      border-right: 1px solid var(--disabled);
      ${selectors.rtl} {
        padding-left: var(--padding-h);
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
        padding-left: var(--padding-h);
        ${selectors.rtl} {
          padding-right: var(--padding-h);
          padding-left: 0;
        }
      }
    }
    li {
      list-style: none;
      &.group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
    }
    a {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: var(--subtitle1);
      font-weight: var(--weight-light);
      color: var(--link);
      text-decoration: none;
      transition-property: color, font-weight, font-style;
      transition-duration: var(--font-transition-duration);
      --icon-weight: 300;
      &:visited {
        color: var(--link-visited);
      }
      &:hover:not(.active) {
        color: var(--link-hover);
        font-weight: var(--weight-medium);
        --icon-weight: 700;
        &:visited {
          color: var(--link-visited-hover);
        }
      }
      &.active {
        font-weight: var(--weight-semibold);
        font-style: italic;
        color: var(--link-current);
        --icon-fill: 1;
      }
    }
  `;

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
                    class=${classMap({ active: isActiveLink(item.href) })}
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
                            class=${classMap({
                              active: isActiveLink(subItem.href),
                            })}
                          >
                            <material-symbol>
                              ${subItem.icon ?? item.childIcon}
                            </material-symbol>
                            ${subItem.label}
                          </a>
                        </li>
                      `
                    )}
                  </ul>
                </li>
              `;
            } else {
              return html`
                <li>
                  <a
                    href=${item.href}
                    class=${classMap({ active: isActiveLink(item.href) })}
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
