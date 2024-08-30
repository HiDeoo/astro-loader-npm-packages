import { z } from 'astro/zod'

const npmPackageInfosSchema = z.object({
  name: z.string(),
  scope: z.union([z.literal('unscoped'), z.string()]),
  version: z.string(),
  description: z.string(),
  keywords: z.array(z.string()),
  date: z.coerce.date(),
  links: z.object({
    npm: z.string(),
    homepage: z.string().optional(),
    repository: z.string().optional(),
    bugs: z.string().optional(),
  }),
  author: z.object({
    name: z.string(),
    email: z.string().optional(),
    url: z.string().optional(),
  }),
  publisher: z.object({
    username: z.string(),
    email: z.string().optional(),
  }),
  maintainers: z.array(
    z.object({
      username: z.string(),
      email: z.string().optional(),
    }),
  ),
})

export const NpmPackageSchema = z.object({
  package: npmPackageInfosSchema,
  flags: z.object({
    insecure: z.number(),
    unstable: z.boolean().optional(),
  }),
  score: z.object({
    final: z.number(),
    detail: z.object({
      quality: z.number(),
      popularity: z.number(),
      maintenance: z.number(),
    }),
  }),
  searchScore: z.number(),
})

export const NpmPackagesResponseSchema = z.object({
  objects: z.array(z.object({ package: z.object({ name: z.string() }).passthrough() }).passthrough()),
  total: z.number(),
  time: z.coerce.date(),
})
