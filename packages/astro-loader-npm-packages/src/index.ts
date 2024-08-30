import { AstroError } from 'astro/errors'
import type { Loader } from 'astro/loaders'
import Slugger from 'github-slugger'

import pkg from '../package.json'

import { NpmPackagesLoaderConfigSchema, type NpmPackagesLoaderUserConfig } from './libs/config'
import { fetchPackagesByAuthor } from './libs/npm'
import { NpmPackageSchema } from './libs/schema'

export function npmPackagesLoader(userConfig: NpmPackagesLoaderUserConfig): Loader {
  const parsedConfig = NpmPackagesLoaderConfigSchema.safeParse(userConfig)

  if (!parsedConfig.success) {
    throw new AstroError(
      `The provided loader configuration is invalid.\n${parsedConfig.error.issues.map((issue) => issue.message).join('\n')}`,
      `See the error report above for more informations.\n\nIf you believe this is a bug, please file an issue at ${pkg.bugs}/new/choose`,
    )
  }

  const config = parsedConfig.data

  return {
    name: 'npm-packages-loader',
    schema: NpmPackageSchema,
    async load({ logger, parseData, store }) {
      const packages = await fetchPackagesByAuthor({ author: config.author, logger })
      const slugger = new Slugger()

      for (const pkg of packages) {
        const id = slugger.slug(pkg.package.name)
        const parsedPkg = await parseData({ id, data: pkg })
        store.set({ id, data: parsedPkg })
      }
    },
  }
}
