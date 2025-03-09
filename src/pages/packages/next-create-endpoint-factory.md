---
layout: packages
title: Create Endpoint Factory
label: Create Endpoint Factory
description: For creating NextJS API routes easily
icon: api
package: next-create-endpoint-factory
repo: actual-experience/create-endpoint-factory
docs: https://actual-experience.github.io/create-endpoint-factory/
---

A utility for creating API route handlers for NextJS apps using the pages router.

```ts
import { createEndpointFactory } from "next-create-endpoint-factory";

export const createEndpoint = createEndpointFactory();
```

```ts
import { createEndpoint } from "./api";

const endpoint = createEndpoint({
  methods: (method) => ({
    get: method<string>({
      handler: () => {
        return "foo";
      },
    }),
    post: method<void>({
      handler: ({ body }, { failWithCode }) => {
        console.log(body);
        if (!body) {
          throw failWithCode(400, "no body");
        }
      },
    }),
  }),
});

export default endpoint.handler;
```
