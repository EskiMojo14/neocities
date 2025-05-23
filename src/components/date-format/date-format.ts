import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import * as v from "valibot";
import type { Style } from "../../constants/prefs.ts";
import { stylePref } from "../../constants/prefs.ts";
import { dateFormat } from "../../utils/index.ts";
import { cache } from "../../utils/lit.ts";
import * as vUtils from "../../utils/valibot.ts";

@customElement("date-format")
export default class DateFormat extends LitElement {
  @property({ type: String })
  date = "";

  @cache(({ date, pageStyle }) => [date, pageStyle])
  get formattedDate() {
    return dateFormat(v.parse(vUtils.coerceDate, this.date), this.pageStyle);
  }

  @state()
  pageStyle: Style = stylePref.fallback;

  eventAc: AbortController | undefined;

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener(
      "stylechange",
      (e) => (this.pageStyle = e.newStyle),
      {
        signal: (this.eventAc = new AbortController()).signal,
      },
    );
  }
  firstUpdated() {
    this.pageStyle = stylePref.data;
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.eventAc?.abort();
  }

  render() {
    return html`<time datetime="${this.date}">${this.formattedDate}</time>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "date-format": DateFormat;
  }
}
