import { LitElement, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { html } from "lit-html";
import { classMap } from "lit-html/directives/class-map.js";
import { map } from "lit-html/directives/map.js";
import { when } from "lit-html/directives/when.js";
import { ifDefined } from "lit-html/directives/if-defined.js";
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

@customElement("sidebar-nav-label")
export class SidebarLabel extends LitElement {
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
    div {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      & > ::slotted([slot="icon"]) {
        --icon-weight: 300;
      }
      &:hover:not(.active) {
        font-weight: bold;
        & > ::slotted([slot="icon"]) {
          --icon-weight: 700;
        }
      }
      &.active {
        & > ::slotted([slot="icon"]) {
          --icon-fill: 1;
        }
      }
    }
  `;

  @property({ type: String })
  href?: string;

  render() {
    return html`
      <div class=${classMap({ active: isActiveLink(this.href) })}>
        <slot name="icon"></slot>
        ${when(
          this.href,
          (href) => html`<a href=${href}><slot></slot></a>`,
          () => html`<slot></slot>`
        )}
      </div>
    `;
  }
}

@customElement("sidebar-nav")
export class Sidebar extends LitElement {
  static styles = css`
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
        align-items: flex-start;
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
                  <sidebar-nav-label href=${ifDefined(item.href)}>
                    <material-symbol slot="icon">${item.icon}</material-symbol>
                    ${item.label}
                  </sidebar-nav-label>
                  <ul>
                    ${map(
                      item.items,
                      (subItem) => html`
                        <li>
                          <sidebar-nav-label href=${subItem.href}>
                            <material-symbol slot="icon"
                              >${subItem.icon ??
                              item.childIcon}</material-symbol
                            >
                            ${subItem.label}
                          </sidebar-nav-label>
                        </li>
                      `
                    )}
                  </ul>
                </li>
              `;
            } else {
              return html`
                <li>
                  <sidebar-nav-label href=${item.href}>
                    <material-symbol slot="icon">${item.icon}</material-symbol>
                    ${item.label}
                  </sidebar-nav-label>
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
    "sidebar-nav-label": SidebarLabel;
    "sidebar-nav": Sidebar;
  }
}
