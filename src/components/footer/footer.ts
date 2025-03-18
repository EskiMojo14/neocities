import { html, LitElement, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";
import base from "../../styles/base.css?type=raw";
import footer from "./footer.css?type=raw";

@customElement("page-footer")
export default class Footer extends LitElement {
  static styles = [unsafeCSS(base), unsafeCSS(footer)];

  render() {
    return html`<footer>
      <section>
        <h4>Links</h4>
        <ul>
          <li>
            <a
              href="https://github.com/eskimojo/neocities"
              target="_blank"
              rel="noopener noreferrer"
              >GitHub</a
            >
          </li>
        </ul>
      </section>
      <section>
        <h4>Made with</h4>
        <ul>
          <li>
            <a
              href="https://greenwoodjs.dev/"
              target="_blank"
              rel="noopener noreferrer"
              >Greenwood</a
            >
          </li>
          <li>
            <a href="https://lit.dev/" target="_blank" rel="noopener noreferrer"
              >Lit</a
            >
          </li>
          <li>
            <a
              href="https://monaspace.githubnext.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Monaspace (font)
            </a>
          </li>
        </ul>
      </section>
    </footer>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "page-footer": Footer;
  }
}
