import { schemaCreateMovie } from '@/forms/createMovie'
import { createTRPCRouter, protectedProcedure } from '..'

export const moviesRoutes = createTRPCRouter({
  movies: protectedProcedure().query(({ ctx }) => {
    return ctx.db.movie.findMany()
  }),
  createMovie: protectedProcedure('admin')
    .input(schemaCreateMovie)
    .mutation(({ ctx, input }) => {
      return ctx.db.movie.create({ data: input })
    }),
})
