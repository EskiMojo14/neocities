---
layout: packages
title: Unchecked Indexed
label: Unchecked Indexed
description: For matching a user's noUncheckedIndexedAccess setting
package: uncheckedindexed
repo: EskiMojo14/uncheckedindexed
---

### `UncheckedIndexedAccess<T>`

Evaluates to `T | undefined` if `noUncheckedIndexedAccess` is enabled, otherwise evaluates to `T`.

```ts
import type { UncheckedIndexedAccess } from "uncheckedindexed";

type SelectById<T> = (
  record: Record<string, T>,
  id: string,
) => UncheckedIndexedAccess<T>;
```

### `IfUncheckedIndexedAccess<True, False>`

Evaluates to `True` if `noUncheckedIndexedAccess` is enabled, otherwise evaluates to `False`.

```ts
import type { IfUncheckedIndexedAccess } from "uncheckedindexed";

type SelectById<T> = (
  record: Record<string, T>,
  id: string,
) => IfUncheckedIndexedAccess<T | undefined, T>;
```
