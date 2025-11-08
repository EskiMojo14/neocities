import { debounce } from "@tanstack/pacer";
import { ScrollStateEvent } from "../constants/events.ts";

if (typeof window !== "undefined") {
  if (window.scrollY > 0) {
    document.documentElement.dataset.scrolled = "true";
  }

  window.addEventListener(
    "scroll",
    debounce(
      () => {
        const scrolled = window.scrollY > 0;

        if (scrolled) {
          document.documentElement.dataset.scrolled = "true";
        } else {
          delete document.documentElement.dataset.scrolled;
        }

        document.documentElement.dispatchEvent(new ScrollStateEvent(scrolled));
      },
      { wait: 100 },
    ),
  );
}
