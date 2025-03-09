---
layout: packages
title: Required React Context
description: For creating React context that needs to be provided
package: required-react-context
repo: EskiMojo14/required-react-context
---

### `createRequiredContext`

A wrapper around React Context to require a value set with a Provider, throwing an error if used outside one. This avoids the often undesirable behavior of silently falling back to a default value.

```tsx
import { createRequiredContext } from "required-react-context";

export const { CountContext, useCount, CountProvider, CountConsumer } =
  createRequiredContext<number>().with({ name: "count" });

function Child() {
  // This will throw an error if used outside a CountProvider
  const count = useCount();
  return <div>{count}</div>;
}

function App() {
  return (
    <CountProvider count={5}>
      <Child />
    </CountProvider>
  );
}
```

The context is required to be given a name, which will be used to name the context hooks and components, and will appear in error messages and devtools.

Individual names can also be given to the hooks and components, which will be used in error messages (and devtools) instead of the defaults derived from the context name.

```tsx
import { createRequiredContext } from "required-react-context";

export const { ACountContext, useACount, ACountProvider, ACountConsumer } =
  createRequiredContext<number>().with({
    name: "count",
    // everything below is optional
    providerProp: "aCount",
    contextName: "ACountContext",
    hookName: "useACount",
    providerName: "ACountProvider",
    consumerName: "ACountConsumer",
  });

function Child() {
  // This will throw an error if used outside ACountProvider
  const count = useACount();
  return <div>{count}</div>;
}

function App() {
  return (
    <ACountProvider aCount={5}>
      <Child />
    </ACountProvider>
  );
}
```

Note that `hookName` is required to start with `"use"`, to match the React hook naming convention.

### `createOptionalContext`

While the main focus of this library is on contexts that require a Provider in the tree, we also recognise that there are valid use cases for a default value to be provided. We think that the naming behaviour of `createRequiredContext` is useful in general, so we provide a similar API for optional contexts.

```tsx
import { createOptionalContext } from "required-react-context";

const { CountContext, useCount, CountProvider, CountConsumer } =
  createOptionalContext<number>(0).with({ name: "count" }); // default value provided

function Child() {
  // This will not throw an error if used outside a CountProvider
  const count = useCount();
  return <div>{count.value}</div>;
}

function App() {
  return (
    <CountProvider count={5}>
      <Child />
    </CountProvider>
  );
}
```

### React 19 - `use`

This library exports a wrapped version of the React 19 `use` hook from the `/canary` entry point, which will throw an error if the context is not set. This can be useful for cases where you want to conditionally read a context, but still require it to be set.

```tsx
import { use } from "required-react-context/canary";

const { CountContext, CountProvider } = createRequiredContext<number>().with({
  name: "count",
});

function ConditionalCount({ show }: { show: boolean }) {
  if (show) {
    const count = use(CountContext); // will still throw if CountProvider is not set
    return <div>{count}</div>;
  }
  return null;
}
```
