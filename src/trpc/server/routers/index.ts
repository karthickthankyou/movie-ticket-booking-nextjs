import { createTRPCRouter, publicProcedure } from '..'
import { moviesRoutes } from './movies'

export const appRouter = createTRPCRouter({
  allUsers: publicProcedure.query(({ ctx }) => {
    return ctx.db.user.findMany()
  }),
  movies: moviesRoutes,
})

export type AppRouter = typeof appRouter
