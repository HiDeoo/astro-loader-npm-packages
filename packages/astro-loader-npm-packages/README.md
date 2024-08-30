<div align="center">
  <h1>astro-loader-npm-packages 📦</h1>
  <p>Astro Content Layer loader to load npm packages from a given author.</p>
</div>

<div align="center">
  <a href="https://github.com/HiDeoo/astro-loader-npm-packages/actions/workflows/integration.yml">
    <img alt="Integration Status" src="https://github.com/HiDeoo/astro-loader-npm-packages/actions/workflows/integration.yml/badge.svg" />
  </a>
  <a href="https://github.com/HiDeoo/astro-loader-npm-packages/blob/main/LICENSE">
    <img alt="License" src="https://badgen.net/github/license/HiDeoo/astro-loader-npm-packages" />
  </a>
  <br />
</div>

## Features

A loader for the experimental Astro [Content Layer API](https://astro.build/blog/future-of-astro-content-layer/) using the npm [public registry search API](https://github.com/npm/registry/blob/main/docs/REGISTRY-API.md#get-v1search) to load all packages from a given author.

> [!IMPORTANT]
> The Astro Content Layer API and this loader are experimental and subject to change.

## Installation

Install the package using your package manager:

```shell
npm i @hideoo/astro-loader-npm-packages
```

## Configuration

To use this loader, enable the [experimental Content Layer API](https://docs.astro.build/en/reference/configuration-reference/#experimentalcontentlayer) in your Astro project by editing your `astro.config.mjs` file:

```diff
export default defineConfig({
+  experimental: {
+    contentLayer: true,
+  },
});
```

You can then use the loader in your Content Layer configuration located in the `src/content/config.ts` file:

```ts
import { npmPackagesLoader } from '@hideoo/astro-loader-npm-packages'
import { defineCollection } from 'astro:content'

// Define a collection using the loader.
const packages = defineCollection({
  loader: npmPackagesLoader({
    // The author to load packages from.
    author: 'hideoo',
  }),
})

export const collections = { packages }
```

## Usage

To query and render the loaded packages, you can use the same API as content collections:

```astro
---
import { getCollection } from 'astro:content'

const packages = await getCollection('packages')
---

<ul>
  {
    packages.map(({ data, id }) => (
      <li>
        <a href={`/pkg/${id}/`}>{data.package.name}</a>
      </li>
    ))
  }
</ul>
```

To learn more about querying and rendering, check the [Astro Content Layer API documentation](https://docs.astro.build/en/reference/configuration-reference/#querying-and-rendering-with-the-content-layer-api).

## License

Licensed under the MIT License, Copyright © HiDeoo.

See [LICENSE](https://github.com/HiDeoo/astro-loader-npm-packages/blob/main/LICENSE) for more information.
