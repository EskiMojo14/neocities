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

  @cache(({ date, pageStyle, showTime }) => [date, pageStyle, showTime])
  get formattedDate() {
    const dateObj = v.parse(vUtils.coerceDate, this.date);
    return this.showTime
      ? timeFormat(dateObj, this.pageStyle)
      : dateFormat(dateObj, this.pageStyle);
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
