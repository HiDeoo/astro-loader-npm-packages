import type { Loader } from 'astro/loaders'

export function npmPackagesLoader(): Loader {
  return {
    name: 'npm-packages-loader',
    async load() {
      // TODO(HiDeoo)
    },
  }
}
