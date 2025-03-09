---
layout: packages
title: Rad Event Listeners
description: For adding multiple event listeners
icon: hearing
package: rad-event-listeners
repo: EskiMojo14/rad-event-listeners
---

### `radEventListeners`

The main API, allowing you to pass an object of event names and handlers, and get back an unsubscribe function for each event (attached to a global unsubscribe function).

```ts
import { radEventListeners } from "rad-event-listeners";

const unsub = radEventListeners(
  window,
  {
    click: (ev) => console.log(ev),
    keydown: [
      {
        handleEvent: (ev) => console.log(ev),
      },
      // Event options
      { once: true },
    ],
  },
  // Global options
  { passive: true },
);

unsub.click();
unsub();
```

### `rads`

An alternative API, which passes the `addEventListener` function to a callback, and only returns a single unsubscribe function.

```ts
import { rads } from "rad-event-listeners";

const unsub = rads(
  window,
  (add) => {
    add("click", (ev) => console.log(ev));
    add("keydown", (ev) => console.log(ev), { once: true });
  },
  { passive: true },
);

// no individual unsubs
unsub();
```
