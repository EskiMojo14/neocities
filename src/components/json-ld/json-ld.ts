import { html, LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { Thing, WithContext } from "schema-dts";
import base from "../../styles/utility/baseline.css?type=raw";

const ESCAPE_ENTITIES = Object.freeze({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
});
const ESCAPE_REGEX = new RegExp(
  `[${Object.keys(ESCAPE_ENTITIES).join("")}]`,
  "g",
);
const ESCAPE_REPLACER = (t: string): string =>
  ESCAPE_ENTITIES[t as keyof typeof ESCAPE_ENTITIES];

/**
 * A replacer for JSON.stringify to strip JSON-LD of illegal HTML entities
 * per https://www.w3.org/TR/json-ld11/#restrictions-for-contents-of-json-ld-script-elements
 */
const safeJsonLdReplacer = (_: string, value: unknown) => {
  switch (typeof value) {
    case "object":
      // Omit null values.
      if (value === null) {
        return undefined;
      }

      return value; // JSON.stringify will recursively call replacer.
    case "number":
    case "boolean":
    case "bigint":
      return value; // These values are not risky.
    case "string":
      return value.replace(ESCAPE_REGEX, ESCAPE_REPLACER);
    default: {
      // JSON.stringify will remove this element.
      return undefined;
    }
  }
};

@customElement("json-ld")
export default class JsonLd extends LitElement {
  static styles = [unsafeCSS(base)];

  @property({ type: Object })
  data: Exclude<Thing, string> = { "@type": "Thing" };

  @property({ type: Number })
  space: number | string = 2;

  render() {
    const withContext: WithContext<typeof this.data> = {
      "@context": "https://schema.org",
      ...this.data,
    };
    return html`
      <script type="application/ld+json">
        ${JSON.stringify(withContext, safeJsonLdReplacer, this.space)}
      </script>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "json-ld": JsonLd;
  }
}
