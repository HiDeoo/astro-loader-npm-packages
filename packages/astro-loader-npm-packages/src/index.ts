import { AstroError } from 'astro/errors'
import type { Loader } from 'astro/loaders'

import pkg from '../package.json'

import { NpmPackagesLoaderConfigSchema, type NpmPackagesLoaderUserConfig } from './libs/config'
import { NpmPackagesResponseSchema, NpmPackageSchema } from './libs/schema'

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
      logger.info(`Loading packages for ${config.author}…`)

      const res = await fetch(`https://registry.npmjs.org/-/v1/search?text=author:${config.author}`)

      if (!res.ok) {
        throw new Error(`Failed to load packages for ${config.author}.`)
      }

      let json: Record<string, unknown>

      try {
        json = (await res.json()) as typeof json
      } catch (error) {
        throw new Error(`Failed to parse packages for ${config.author}.`, { cause: error })
      }

      const parsedPackages = NpmPackagesResponseSchema.safeParse(json)

      if (!parsedPackages.success) {
        throw new Error(`Invalid packages data for ${config.author}.`)
      }

      // TODO(HiDeoo) max
      // TODO(HiDeoo) pagination

      for (const pkg of parsedPackages.data.objects) {
        const id = pkg.package.name
        const parsedPkg = await parseData({ id, data: pkg })
        store.set({ id, data: parsedPkg })
      }
    },
  }
}
