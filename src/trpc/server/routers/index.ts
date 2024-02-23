import { createTRPCRouter } from '..'
import { adminsRoutes } from './admins'
import { cinemasRoutes } from './cinemas'
import { managersRoutes } from './managers'
import { moviesRoutes } from './movies'
import { showtimesRoutes } from './showtimes'

export const appRouter = createTRPCRouter({
  movies: moviesRoutes,
  admins: adminsRoutes,
  cinemas: cinemasRoutes,
  showtimes: showtimesRoutes,
  managers: managersRoutes,
})

export type AppRouter = typeof appRouter
