import { z } from 'zod'

export const stringFilter = z
  .object({
    equals: z.string().optional(),
    in: z.array(z.string()).optional(),
    notIn: z.array(z.string()).optional(),
    lt: z.string().optional(),
    lte: z.string().optional(),
    gt: z.string().optional(),
    gte: z.string().optional(),
    contains: z.string().optional(),
    startsWith: z.string().optional(),
    endsWith: z.string().optional(),
    not: z.string().optional(),
    mode: z.enum(['default', 'insensitive']).default('insensitive').optional(), // Assuming QueryMode is an enum
  })
  .optional()

export const dateTimeFilter = z
  .object({
    equals: z.string().optional(),
    in: z.array(z.string()).optional(),
    notIn: z.array(z.string()).optional(),
    lt: z.string().optional(),
    lte: z.string().optional(),
    gt: z.string().optional(),
    gte: z.string().optional(),
  })
  .optional()

export const SortOrder = z.enum(['asc', 'desc']).optional()

// Zod schema for StringListFilter
export const stringListFilter = z
  .object({
    equals: z.string().array().optional(),
    has: z.string().optional(),
    hasEvery: z.string().array().optional(),
    hasSome: z.string().array().optional(),
    isEmpty: z.boolean().optional(),
  })
  .optional()

// Zod schema for BoolFilter
export const boolFilter = z
  .object({
    equals: z.boolean().optional(),
    not: z.boolean().optional(),
  })
  .optional()

// Zod schema for IntFilter
export const intFilter = z
  .object({
    equals: z.number().optional(),
    lt: z.number().optional(),
    lte: z.number().optional(),
    gt: z.number().optional(),
    gte: z.number().optional(),
  })
  .optional()

// Zod schema for FloatFilter
export const floatFilter = z
  .object({
    equals: z.number().optional(),
    lt: z.number().optional(),
    lte: z.number().optional(),
    gt: z.number().optional(),
    gte: z.number().optional(),
    not: z.number().optional(),
  })
  .optional()

// Zod schema for AggregateCountOutput
export const aggregateCountOutput = z
  .object({
    count: z.number(),
  })
  .optional()

// Zod schema for PaginationInput
export const paginationInput = z
  .object({
    take: z.number().optional(),
    skip: z.number().optional(),
  })
  .optional()

export const locationFilter = z.object({
  ne_lng: z.number(),
  ne_lat: z.number(),
  sw_lng: z.number(),
  sw_lat: z.number(),
})
