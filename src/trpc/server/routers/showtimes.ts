import { createTRPCRouter, protectedProcedure, publicProcedure } from '..'
import { schemaCreateShowtime } from '@/forms/createShowtime'
import { Prisma } from '@prisma/client'

export const showtimesRoutes = createTRPCRouter({
  create: protectedProcedure('admin', 'manager')
    .input(schemaCreateShowtime)
    .mutation(async ({ ctx, input }) => {
      const { movieId, screenId, showtimes } = input
      const screen = await ctx.db.screen.findUnique({
        where: { id: screenId },
        include: { Cinema: { include: { Managers: true } } },
      })

      const showtimesInput: Prisma.ShowtimeCreateManyInput[] = showtimes.map(
        (showtime) => ({
          screenId,
          movieId,
          startTime: new Date(showtime.time),
        }),
      )
      return ctx.db.showtime.createMany({
        data: showtimesInput,
      })
    }),
})
