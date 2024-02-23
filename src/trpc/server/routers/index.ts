import { createTRPCRouter } from '..'
import { adminsRoutes } from './admins'
import { cinemasRoutes } from './cinemas'
import { moviesRoutes } from './movies'

export const appRouter = createTRPCRouter({
  movies: moviesRoutes,
  admins: adminsRoutes,
  cinemas: cinemasRoutes,
})

export type AppRouter = typeof appRouter
