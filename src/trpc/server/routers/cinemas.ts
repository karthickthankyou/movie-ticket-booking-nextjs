import { createTRPCRouter, protectedProcedure, publicProcedure } from '..'
import { findManyCinemaArgsSchema } from './dtos/cinemas.input'

import { schemaCreateCinema } from '@/forms/createCinema'

export const cinemasRoutes = createTRPCRouter({
  cinemas: protectedProcedure()
    .input(findManyCinemaArgsSchema.omit({ addressWhere: true }))
    .query(({ ctx, input }) => {
      return ctx.db.cinema.findMany({
        ...input,
        include: {
          Screens: { include: { Showtimes: { include: { Movie: true } } } },
        },
      })
    }),

  createCinema: protectedProcedure('admin')
    .input(schemaCreateCinema)
    .mutation(({ ctx, input }) => {
      const { address, cinemaName, screens, managerId } = input

      const screensWithSeats = screens.map((screen, index) => {
        const { rows, columns, ...screenData } = screen
        const seats = []

        for (let row = 1; row <= rows; row++) {
          for (let column = 1; column <= columns; column++) {
            seats.push({ row, column })
          }
        }

        return {
          ...screenData,
          Seats: { create: seats },
          number: index,
        }
      })

      return ctx.db.cinema.create({
        data: {
          name: cinemaName,
          Address: { create: address },
          Managers: {
            connectOrCreate: {
              create: { id: managerId },
              where: { id: managerId },
            },
          },
          Screens: { create: screensWithSeats },
        },
      })
    }),
})
