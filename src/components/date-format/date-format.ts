import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import * as v from "valibot";
import type { Style } from "../../constants/prefs.ts";
import { stylePref } from "../../constants/prefs.ts";
import { dateFormat, timeFormat } from "../../utils/index.ts";
import { cache } from "../../utils/lit.ts";
import * as vUtils from "../../utils/valibot.ts";

@customElement("date-format")
export default class DateFormat extends LitElement {
  @property({ type: String })
  date = "";

  @property({ type: Boolean, attribute: "show-time" })
  showTime = false;

  @cache(({ date, pageStyle, showTime }) => [date, pageStyle, showTime])
  get formattedDate() {
    const dateObj = v.parse(vUtils.coerceDate, this.date);
    return this.showTime
      ? timeFormat(dateObj, this.pageStyle)
      : dateFormat(dateObj, this.pageStyle);
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
