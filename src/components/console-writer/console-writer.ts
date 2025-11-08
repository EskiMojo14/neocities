import { html, LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { StyleWatcher } from "../../mixins/style-watcher.ts";
import base from "../../styles/utility/baseline.css?type=raw";
import {
  consolewriter as cwriter,
  prefersReducedMotion,
} from "../../utils/lit.ts";
import consolewriter from "./console-writer.css?type=raw";

@customElement("console-writer")
export default class ConsoleWriter
  extends StyleWatcher(LitElement)
  implements Required<cwriter.Config>
{
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

  render() {
    if (this.pageStyle === "normal" || prefersReducedMotion()) return this.text;
    return html`<span aria-hidden="true" class="console" needs-js
        >${cwriter(this.text, {
          delay: this.delay,
          finishingDelay: this.finishingDelay,
          interval: this.interval,
          minInterval: this.minInterval,
          maxDuration: this.maxDuration,
        })}</span
      ><span class="text">${this.text}</span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "console-writer": ConsoleWriter;
  }
}
