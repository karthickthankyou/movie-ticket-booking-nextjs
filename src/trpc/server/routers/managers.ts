import { schemaCreateManager } from '@/forms/createManager'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '..'

export const managersRoutes = createTRPCRouter({
  dashboard: protectedProcedure('manager').query(async ({ ctx }) => {
    const cinemaCount = await ctx.db.cinema.count({
      where: { Managers: { some: { id: ctx.session.userId } } },
    })

    return { cinemaCount }
  }),
  managerMe: protectedProcedure().query(async ({ ctx }) => {
    return ctx.db.manager.findUnique({
      where: { id: ctx.session.userId },
      include: { User: true },
    })
  }),
  managers: protectedProcedure().query(async ({ ctx }) => {
    return ctx.db.manager.findMany({
      include: { User: true },
    })
  }),
  create: protectedProcedure('admin')
    .input(schemaCreateManager)
    .mutation(({ ctx, input }) => {
      return ctx.db.manager.create({ data: { id: input.id } })
    }),
})
