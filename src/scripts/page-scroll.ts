import { ScrollStateEvent } from "../constants/events.ts";

if (window.scrollY > 0) {
  document.documentElement.dataset.scrolled = "true";
}

window.addEventListener("scroll", () => {
  const scrolled = window.scrollY > 0;
  if (scrolled) {
    document.documentElement.dataset.scrolled = "true";
  } else {
    delete document.documentElement.dataset.scrolled;
  }

  document.documentElement.dispatchEvent(new ScrollStateEvent(scrolled));
});
