import { z } from 'zod'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '..'

export const ticketsRoutes = createTRPCRouter({
  myTickets: protectedProcedure().query(({ ctx }) => {
    return ctx.db.ticket.findMany({
      where: { uid: { equals: ctx.session.userId } },
      include: {
        Bookings: {
          include: {
            Showtime: {
              include: { Movie: true, Screen: { include: { Cinema: true } } },
            },
          },
        },
      },
    })
  }),
})
