import { npmPackagesLoader } from '@hideoo/astro-loader-npm-packages'
import { defineCollection } from 'astro:content'

const packages = defineCollection({ loader: npmPackagesLoader({ author: 'hideoo' }) })

export const collections = {
  packages,
}
