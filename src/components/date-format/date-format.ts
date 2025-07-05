import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import * as v from "valibot";
import { withStyle } from "../../mixins/page-style.ts";
import { dateFormat, timeFormat } from "../../utils/index.ts";
import { cache } from "../../utils/lit.ts";
import * as vUtils from "../../utils/valibot.ts";

@customElement("date-format")
export default class DateFormat extends withStyle(LitElement) {
  @property({ type: String })
  date = "";

  @property({ type: Boolean, attribute: "show-time" })
  showTime = false;

  @cache(({ date }) => [date])
  get dateObj() {
    return v.parse(vUtils.coerceDate, this.date);
  }

  @cache(({ dateObj, showTime }) => [dateObj, showTime])
  get dateLabel() {
    return this.showTime
      ? timeFormat(this.dateObj, "normal")
      : dateFormat(this.dateObj, "normal");
  }

  @cache(({ dateObj, pageStyle, showTime }) => [dateObj, pageStyle, showTime])
  get formattedDate() {
    return this.showTime
      ? timeFormat(this.dateObj, this.pageStyle)
      : dateFormat(this.dateObj, this.pageStyle);
  }

  render() {
    return html`<time datetime="${this.date}" title="${this.dateLabel}"
      >${this.formattedDate}</time
    >`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "date-format": DateFormat;
  }
}
