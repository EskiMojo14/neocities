import { html, LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import base from "../../styles/utility/baseline.css?type=raw";
import { consolewriter as cwriter } from "../../utils/lit.ts";
import consolewriter from "./console-writer.css?type=raw";
import { consume } from "@lit/context";
import { stylePref, type Style } from "../../constants/prefs.ts";

@customElement("console-writer")
export default class ConsoleWriter extends LitElement implements Required<cwriter.Config> {
  static styles = [unsafeCSS(base), unsafeCSS(consolewriter)];

  @property({ type: String })
  text = "";

  @property({ type: Number })
  delay = cwriter.defaults.delay;
  @property({ type: Number })
  finishingDelay = cwriter.defaults.finishingDelay;
  @property({ type: Number })
  interval = cwriter.defaults.interval;
  @property({ type: Number })
  minInterval = cwriter.defaults.minInterval;
  @property({ type: Number })
  maxDuration = cwriter.defaults.maxDuration;

  @consume({ context: stylePref.context, subscribe: true })
  pageStyle: Style = stylePref.fallback;

  render() {
    if (this.pageStyle === "normal") return this.text;
    return html`<span class="sr-only">${this.text}</span
      ><span aria-hidden="true" class="console" needs-js
        >${cwriter(this.text, {
          delay: this.delay,
          finishingDelay: this.finishingDelay,
          interval: this.interval,
          minInterval: this.minInterval,
          maxDuration: this.maxDuration,
        })}</span
      >`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "console-writer": ConsoleWriter;
  }
}
