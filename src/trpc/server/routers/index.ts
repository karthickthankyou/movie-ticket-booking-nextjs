import { createTRPCRouter } from '..'
import { adminsRoutes } from './admins'
import { cinemasRoutes } from './cinemas'
import { managersRoutes } from './managers'
import { moviesRoutes } from './movies'
import { showtimesRoutes } from './showtimes'
import { stripeRoutes } from './stripe'

export const appRouter = createTRPCRouter({
  movies: moviesRoutes,
  admins: adminsRoutes,
  cinemas: cinemasRoutes,
  showtimes: showtimesRoutes,
  managers: managersRoutes,
  stripe: stripeRoutes,
})

export type AppRouter = typeof appRouter
