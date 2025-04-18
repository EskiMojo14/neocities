import { html, LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { ref } from "lit/directives/ref.js";
import { repeat } from "lit/directives/repeat.js";
import * as v from "valibot";
import base from "../../styles/utility/baseline.css?type=raw";
import { cache, smoothScroll, styleMap } from "../../utils/lit.ts";
import * as vUtils from "../../utils/valibot.ts";
import { toggleButton } from "../button/toggle.ts";
import carousel from "./carousel.css?type=raw";

const carouselItemSchema = v.object({
  src: v.string(),
  alt: v.optional(v.string()),
  aspectRatio: v.optional(v.tuple([v.number(), v.number()])),
});

type CarouselItem = v.InferOutput<typeof carouselItemSchema>;

const itemsSchema = vUtils.maybeJson(
  v.array(
    v.union([
      v.pipe(
        carouselItemSchema.entries.src,
        v.transform((src): CarouselItem => ({ src })),
      ),
      carouselItemSchema,
    ]),
  ),
);

@customElement("img-carousel")
export default class Carousel extends LitElement {
  static styles = [unsafeCSS(base), unsafeCSS(carousel)];

  @property({ type: Array })
  items: v.InferInput<typeof itemsSchema> = [];

  @cache(({ items }) => [items])
  get parsedItems() {
    try {
      return v.parse(itemsSchema, this.items);
    } catch (e) {
      console.error(e instanceof v.ValiError ? e.issues : e);
      return [];
    }
  }

  imgsByIdx: Array<Element> = [];

  scrollToImg(idx: number) {
    const img = this.imgsByIdx[idx];
    if (!img) return;
    this.currentIdx = idx;
    img.scrollIntoView({ behavior: smoothScroll(), block: "nearest" });
  }

  @property({ type: Number })
  currentIdx = 0;

  intersectionObserver: IntersectionObserver | undefined;
  setupIntersectionObserver(root: Element) {
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.currentIdx = this.imgsByIdx.indexOf(entry.target);
          }
        }
      },
      { root, threshold: 0.95 },
    );
  }

  render() {
    return html`
      <div
        class="carousel"
        ${ref((carousel) => {
          if (carousel) this.setupIntersectionObserver(carousel);
          else this.intersectionObserver?.disconnect();
        })}
        style=${styleMap({
          "--carousel-w": this.parsedItems[this.currentIdx]?.aspectRatio?.[0],
          "--carousel-h": this.parsedItems[this.currentIdx]?.aspectRatio?.[1],
        })}
      >
        ${repeat(
          this.parsedItems,
          (item) => item,
          (item, idx) =>
            html`<div
              class="img-container"
              ${ref((img) => {
                if (!img) return;
                this.imgsByIdx[idx] = img;
                this.intersectionObserver?.observe(img);
              })}
            >
              <img
                src=${item.src.replace("assets/", "assets/thumbs/")}
                alt=${ifDefined(item.alt)}
              />
            </div>`,
        )}
      </div>
      <div class="controls" needs-js>
        <button
          class="icon"
          @click=${() => {
            this.scrollToImg(
              (this.currentIdx - 1 + this.parsedItems.length) %
                this.parsedItems.length,
            );
          }}
        >
          <material-symbol aria-hidden="true">chevron_left</material-symbol>
        </button>
        <fieldset
          class="button-group"
          @change=${(ev: Event) => {
            this.scrollToImg(parseInt((ev.target as HTMLInputElement).value));
          }}
        >
          <legend class="sr-only">Carousel</legend>
          ${repeat(
            Array.from({ length: this.parsedItems.length }, (_, i) => i),
            (i) => i,
            (idx) =>
              toggleButton(idx, {
                name: "carousel",
                value: idx.toString(),
                checked: idx === this.currentIdx,
              }),
          )}
        </fieldset>
        <button
          class="icon"
          @click=${() => {
            this.scrollToImg((this.currentIdx + 1) % this.parsedItems.length);
          }}
        >
          <material-symbol aria-hidden="true">chevron_right</material-symbol>
        </button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "img-carousel": Carousel;
  }
}
