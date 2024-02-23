import { createTRPCRouter, protectedProcedure } from '..'

export const moviesRoutes = createTRPCRouter({
  movies: protectedProcedure().query(({ ctx }) => {
    return ctx.db.movie.findMany()
  }),
})
