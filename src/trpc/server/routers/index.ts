import { createTRPCRouter } from '..'
import { adminsRoutes } from './admins'
import { cinemasRoutes } from './cinemas'
import { managersRoutes } from './managers'
import { moviesRoutes } from './movies'
import { showtimesRoutes } from './showtimes'
import { stripeRoutes } from './stripe'
import { ticketsRoutes } from './tickets'

export const appRouter = createTRPCRouter({
  movies: moviesRoutes,
  admins: adminsRoutes,
  cinemas: cinemasRoutes,
  showtimes: showtimesRoutes,
  managers: managersRoutes,
  stripe: stripeRoutes,
  tickets: ticketsRoutes,
})

export type AppRouter = typeof appRouter
