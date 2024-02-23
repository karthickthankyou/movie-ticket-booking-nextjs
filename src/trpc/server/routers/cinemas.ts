import { z } from 'zod'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '..'
import { findManyCinemaArgsSchema } from './dtos/cinemas.input'

import { schemaCreateCinema } from '@/forms/createCinema'
import { locationFilter } from './dtos/common'

export const cinemasRoutes = createTRPCRouter({
  searchCinemas: publicProcedure
    .input(findManyCinemaArgsSchema)
    .input(z.object({ addressWhere: locationFilter }))
    .query(async ({ input, ctx }) => {
      const { cursor, distinct, orderBy, skip, take, where, addressWhere } =
        input

      const { ne_lat, ne_lng, sw_lat, sw_lng } = addressWhere
      return ctx.db.cinema.findMany({
        cursor,
        distinct,
        orderBy,
        skip,
        take,
        where: {
          ...where,
          Address: {
            lat: { lte: ne_lat, gte: sw_lat },
            lng: { lte: ne_lng, gte: sw_lng },
          },
        },
        include: {
          Address: true,
        },
      })
    }),
  cinema: publicProcedure
    .input(z.object({ cinemaId: z.number().nullable() }))
    .query(({ ctx, input: { cinemaId } }) => {
      if (!cinemaId) {
        return null
      }
      return ctx.db.cinema.findUnique({
        where: { id: cinemaId },
        include: { Address: true },
      })
    }),
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
  myCinemas: protectedProcedure()
    .input(findManyCinemaArgsSchema.omit({ addressWhere: true }))
    .query(({ ctx, input }) => {
      return ctx.db.cinema.findMany({
        ...input,
        where: {
          ...input.where,
          Managers: { some: { id: ctx.session.userId } },
        },
        include: {
          Screens: { include: { Showtimes: { include: { Movie: true } } } },
        },
      })
    }),

  myScreens: protectedProcedure().query(({ ctx }) => {
    return ctx.db.screen.findMany({
      where: {
        Cinema: {
          Managers: { some: { id: ctx.session.userId } },
        },
      },
      include: {
        Cinema: true,
      },
    })
  }),
})
