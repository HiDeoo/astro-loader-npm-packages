import type { AstroIntegrationLogger } from 'astro'

import { NpmPackagesResponseSchema, type NpmPackagesResponse } from './schema'

const resultsPerPage = 250

export async function fetchPackagesByAuthor(params: FetchPackagesByAuythorParams): Promise<Packages> {
  let page = 1
  const allPackages: Packages = []

  while (true) {
    const packages = await fetchPaginatedPackagesByAuthor(params, page)
    allPackages.push(...packages)

    if (packages.length < resultsPerPage) break

    page += 1
  }

  return allPackages
}

async function fetchPaginatedPackagesByAuthor(
  { author, logger }: FetchPackagesByAuythorParams,
  page = 1,
): Promise<Packages> {
  const isNotFirstPage = page > 1

  logger.info(`Loading packages for ${author}${isNotFirstPage ? ` (page: ${page})` : ''}…`)

  const url = new URL('https://registry.npmjs.org/-/v1/search')
  url.searchParams.set('text', `author:${author}`)
  url.searchParams.set('size', String(resultsPerPage))

  if (isNotFirstPage) {
    url.searchParams.set('from', String((page - 1) * resultsPerPage))
  }

  const res = await fetch(url)

  if (!res.ok) {
    throw new Error(`Failed to load packages for ${author}.`)
  }

  let json: unknown

  try {
    json = await res.json()
  } catch (error) {
    throw new Error(`Failed to parse packages for ${author}.`, { cause: error })
  }

  const parsedPackages = NpmPackagesResponseSchema.safeParse(json)

  if (!parsedPackages.success) {
    throw new Error(`Invalid packages data for ${author}.`)
  }

  return parsedPackages.data.objects
}

interface FetchPackagesByAuythorParams {
  author: string
  logger: AstroIntegrationLogger
}

type Packages = NpmPackagesResponse['objects']
