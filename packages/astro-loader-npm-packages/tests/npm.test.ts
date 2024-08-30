import type { AstroIntegrationLogger } from 'astro'
import { expect, test } from 'vitest'

import { fetchPackagesByAuthor } from '../src/libs/npm'

import { mockNextPackagesResponse, server } from './server'

test('fetches packages', async () => {
  const packages = await fetchTestPackagesByAuthor('hideoo')

  expect(packages).toHaveLength(10)
})

test('fetches packages from multiple pages', async () => {
  server.use(
    mockNextPackagesResponse(250),
    mockNextPackagesResponse(250),
    mockNextPackagesResponse(250),
    mockNextPackagesResponse(10),
  )

  const packages = await fetchTestPackagesByAuthor('hideoo')

  expect(packages).toHaveLength(760)
})

function fetchTestPackagesByAuthor(author: string) {
  return fetchPackagesByAuthor({ author, logger: { info: () => undefined } as unknown as AstroIntegrationLogger })
}
