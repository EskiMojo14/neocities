export class ScrollStateEvent extends Event {
  scrolled: boolean;
  constructor(scrolled: boolean) {
    super("scrollstate", { bubbles: true, composed: true });
    this.scrolled = scrolled;
  }
}

declare global {
  interface GlobalEventHandlersEventMap {
    scrollstate: ScrollStateEvent;
  }
}
