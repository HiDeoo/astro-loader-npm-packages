import { z } from 'astro/zod'

export const NpmPackagesLoaderConfigSchema = z.object({
  /**
   * The author of the packages to load.
   */
  author: z.string(),
})

export type NpmPackagesLoaderUserConfig = z.input<typeof NpmPackagesLoaderConfigSchema>
export type NpmPackagesLoaderConfig = z.output<typeof NpmPackagesLoaderConfigSchema>
