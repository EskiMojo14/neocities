---
layout: packages
title: Mix 'n' Matchers
label: Mix 'n' Matchers
description: Some Jest/Vitest compatible matchers
icon: festival
package: mix-n-matchers
devDep: true
repo: EskiMojo14/mix-n-matchers
docs: https://eskimojo14.github.io/mix-n-matchers/
---

Adds some useful matchers to Jest or Vitest.

```ts
expect(mock).toHaveBeenCalledWithContext(expect.exactly(service));

expect(iterable).toContainSequence(1, 2, 3);

expect(getDirection()).toBeEnum(Direction);

expect(post).toEqual({
  id: expect.typeOf("string"),
  status: expect.oneOf(["pinned", "archived", undefined]),
});
```
