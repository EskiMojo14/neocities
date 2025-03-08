---
layout: packages
title: Unchecked Indexed
label: Unchecked Indexed
description: For libraries to match a user's noUncheckedIndexedAccess setting
---

```ts
import type {
  UncheckedIndexedAccess,
  IfUncheckedIndexedAccess,
} from "uncheckedindexed";

// string if noUncheckedIndexedAccess is false, string | undefined if true
type ExtractedData = UncheckedIndexedAccess<string>;
type ExtractedData2 = IfUncheckedIndexedAccess<string, string | undefined>;
```
