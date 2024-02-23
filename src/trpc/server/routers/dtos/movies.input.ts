import { z } from 'zod'
import { SortOrder, intFilter } from './common'

const movieOrderByWithRelationInputSchema = z.object({
  id: SortOrder,
})

const movieWhereInputSchemaPrimitive = z.object({
  id: intFilter,
})

export const movieWhereInputSchema = z.union([
  movieWhereInputSchemaPrimitive,

  z.object({
    AND: z.array(movieWhereInputSchemaPrimitive).optional(),
    OR: z.array(movieWhereInputSchemaPrimitive).optional(),
    NOT: z.array(movieWhereInputSchemaPrimitive).optional(),
  }),
])

const movieWhereUniqueInputSchema = z.object({
  id: z.number(),
})

export const findManyMovieArgsSchema = z.object({
  where: movieWhereInputSchema.optional(),
  orderBy: z.array(movieOrderByWithRelationInputSchema).optional(),
  cursor: movieWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.array(z.enum(['id'])).optional(),
})

export const movieScalarFieldEnumSchema = z.enum(['id'])
