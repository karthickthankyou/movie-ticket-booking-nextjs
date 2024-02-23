import { createTRPCRouter, protectedProcedure, publicProcedure } from '..'
import { schemaCreateShowtime } from '@/forms/createShowtime'
import { Prisma } from '@prisma/client'
import { z } from 'zod'

export const showtimesRoutes = createTRPCRouter({
  seats: publicProcedure
    .input(z.object({ showtimeId: z.number() }))
    .query(async ({ ctx, input: { showtimeId } }) => {
      const showtime = await ctx.db.showtime.findUnique({
        where: { id: showtimeId },
        include: { Screen: { include: { Seats: true } } },
      })

      // Add booked information to each seat
      const seatsWithBookingInfo = await Promise.all(
        showtime?.Screen.Seats.map(async (seat) => {
          const booking = await ctx.db.booking.findUnique({
            where: {
              uniqueSeatShowtime: {
                column: seat.column,
                row: seat.row,
                screenId: seat.screenId,
                showtimeId,
              },
            },
          })

          return {
            ...seat,
            booked: booking?.id ? true : false,
          }
        }) || [],
      )

      const ticketPrice = await ctx.db.showtime.findUnique({
        where: { id: showtimeId },
        include: { Screen: true },
      })

      return { seats: seatsWithBookingInfo, price: ticketPrice?.Screen.price }
    }),
  seatsInfo: publicProcedure
    .input(z.object({ showtimeId: z.number() }))
    .query(async ({ ctx, input }) => {
      const { showtimeId } = input
      const showtime = await ctx.db.showtime.findUnique({
        where: { id: showtimeId },
      })
      const total = await ctx.db.seat.count({
        where: { screenId: showtime?.screenId },
      })
      const booked = await ctx.db.booking.count({
        where: { showtimeId: showtimeId },
      })

      return { total, booked }
    }),
  showtimesPerCinema: publicProcedure
    .input(z.object({ cinemaId: z.number(), movieId: z.number() }))
    .query(async ({ input, ctx }) => {
      const { movieId, cinemaId } = input

      const rawShowtimes = await ctx.db.showtime.findMany({
        where: {
          movieId: movieId,
          Screen: {
            cinemaId: cinemaId,
          },
          startTime: {
            gt: new Date(),
          },
        },
        orderBy: {
          startTime: 'asc',
        },
        include: {
          Screen: true,
        },
      })

      // Group showtimes by date
      const showtimesByDate = reduceShowtimeByDate(rawShowtimes)

      // Convert object to the desired array format
      return Object.values(showtimesByDate)
    }),
  showtimesPerScreen: publicProcedure
    .input(z.object({ screenId: z.number() }))
    .query(async ({ input, ctx }) => {
      const { screenId } = input

      const rawShowtimes = await ctx.db.showtime.findMany({
        where: {
          screenId,
          startTime: {
            gt: new Date(),
          },
        },
        orderBy: {
          startTime: 'asc',
        },
        include: {
          Screen: true,
          Movie: true,
        },
      })

      // Group showtimes by date
      const showtimesByDate = reduceShowtimeByDate(rawShowtimes)

      // Convert object to the desired array format
      return Object.values(showtimesByDate)
    }),
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
export const reduceShowtimeByDate = <T extends { startTime: Date }>(
  rawShowtimes: T[],
) => {
  return rawShowtimes.reduce(
    (grouped, showtime) => {
      const date = showtime.startTime.toISOString().split('T')[0]

      if (!grouped[date]) {
        grouped[date] = { date, showtimes: [] }
      }
      grouped[date].showtimes.push(showtime)

      return grouped
    },
    {} as {
      [date: string]: {
        date: string
        showtimes: T[]
      }
    },
  )
}
