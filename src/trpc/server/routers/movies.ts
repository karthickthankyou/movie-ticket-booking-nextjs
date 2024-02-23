import { schemaCreateMovie } from '@/forms/createMovie'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '..'
import { findManyMovieArgsSchema } from './dtos/movies.input'
import { z } from 'zod'

export const moviesRoutes = createTRPCRouter({
  movies: protectedProcedure().query(({ ctx }) => {
    return ctx.db.movie.findMany()
  }),
  createMovie: protectedProcedure('admin')
    .input(schemaCreateMovie)
    .mutation(({ ctx, input }) => {
      return ctx.db.movie.create({ data: input })
    }),
  moviesPerCinema: publicProcedure
    .input(findManyMovieArgsSchema)
    .input(z.object({ cinemaId: z.number() }))
    .query(async ({ input, ctx }) => {
      const { cursor, distinct, orderBy, skip, take, where, cinemaId } = input

      return ctx.db.movie.findMany({
        cursor,
        distinct,
        orderBy,
        skip,
        take,
        where: {
          ...where,
          Showtimes: {
            some: {
              startTime: {
                gt: new Date(),
              },
              Screen: {
                cinemaId,
              },
            },
          },
        },
      })
    }),
})
