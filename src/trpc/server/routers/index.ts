import { createTRPCRouter } from '..'
import { adminsRoutes } from './admins'
import { moviesRoutes } from './movies'

export const appRouter = createTRPCRouter({
  movies: moviesRoutes,
  admins: adminsRoutes,
})

export type AppRouter = typeof appRouter
