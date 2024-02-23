import { z } from 'zod'
import { SortOrder, intFilter, stringFilter } from './common'

const cinemaOrderByWithRelationInputSchema = z.object({
  id: SortOrder,
})

const cinemaWhereInputSchemaPrimitive = z.object({
  id: intFilter,
})

const addressWhere = z.object({
  ne_lng: z.number(),
  ne_lat: z.number(),
  sw_lng: z.number(),
  sw_lat: z.number(),
})

export const cinemaWhereInputSchema = z.union([
  cinemaWhereInputSchemaPrimitive,

  z.object({
    AND: z.array(cinemaWhereInputSchemaPrimitive).optional(),
    OR: z.array(cinemaWhereInputSchemaPrimitive).optional(),
    NOT: z.array(cinemaWhereInputSchemaPrimitive).optional(),
  }),
])

const cinemaWhereUniqueInputSchema = z.object({
  id: z.number(),
})

export const findManyCinemaArgsSchema = z.object({
  where: cinemaWhereInputSchema.optional(),
  orderBy: z.array(cinemaOrderByWithRelationInputSchema).optional(),
  cursor: cinemaWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.array(z.enum(['id'])).optional(),
  addressWhere,
})

export const cinemaScalarFieldEnumSchema = z.enum(['id'])
