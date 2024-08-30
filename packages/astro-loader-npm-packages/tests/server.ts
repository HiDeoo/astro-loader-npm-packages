import { http, HttpResponse, type RequestHandler } from 'msw'
import { setupServer } from 'msw/node'

export const handlers: RequestHandler[] = [
  http.get('https://registry.npmjs.org/-/v1/search', () => HttpResponse.json(mockPackages(10))),
]

export const server = setupServer(...handlers)

export function mockNextPackagesResponse(count: number) {
  return http.get('https://registry.npmjs.org/-/v1/search', () => HttpResponse.json(mockPackages(count)), {
    once: true,
  })
}

function mockPackages(count: number) {
  return {
    objects: Array.from({ length: count }, () => mockPackage()),
    total: count,
    time: 'Fri Aug 30 2024 18:20:08 GMT+0200 (Central European Summer Time)',
  }
}

// https://registry.npmjs.org/-/v1/search?text=author:hideoo
function mockPackage() {
  return {
    package: {
      name: '@hideoo/fake-package',
      scope: 'hideoo',
      version: '0.0.1',
      description: 'A fake package for testing purposes',
      keywords: ['test'],
      date: '2024-08-30T16:20:08.091Z',
      links: {
        npm: 'https://www.npmjs.com/package/%40hideoo%2Ffake-package',
        homepage: 'https://github.com/HiDeoo/fake-package',
        repository: 'https://github.com/HiDeoo/fake-package',
        bugs: 'https://github.com/HiDeoo/fake-package/issues',
      },
      author: { name: 'HiDeoo', email: 'github@hideoo.dev', url: 'https://hideoo.dev' },
      publisher: { username: 'hideoo', email: 'hideo.sup@gmail.com' },
      maintainers: [{ username: 'hideoo', email: 'hideo.sup@gmail.com' }],
    },
    flags: { insecure: 0 },
    score: {
      final: 0.280_871_912_013_459_2,
      detail: {
        quality: 0.539_549_694_606_603_7,
        popularity: 0.007_175_741_200_418_268,
        maintenance: 0.332_844_269_175_233_35,
      },
    },
    searchScore: 4.459_67e-8,
  }
}
