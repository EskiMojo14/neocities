---
layout: packages
title: Unchecked Indexed
label: Unchecked Indexed
description: For matching a user's noUncheckedIndexedAccess setting
package: uncheckedindexed
---

```ts
import type {
  UncheckedIndexedAccess,
  IfUncheckedIndexedAccess,
} from "uncheckedindexed";

// string if noUncheckedIndexedAccess is false, string | undefined if true
type ExtractedData = UncheckedIndexedAccess<string>;
// which is a shortcut for
type ExtractedData2 = IfUncheckedIndexedAccess<string, string | undefined>;
```
