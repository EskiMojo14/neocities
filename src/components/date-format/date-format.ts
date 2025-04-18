import { LitElement } from "lit";
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

  @cache(({ date }) => [date])
  get formattedDate() {
    return dateFormat.format(v.parse(vUtils.coerceDate, this.date));
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
    return this.pageStyle === "code" ? this.date : this.formattedDate;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "date-format": DateFormat;
  }
}
