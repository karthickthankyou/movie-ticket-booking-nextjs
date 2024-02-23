import { schemaCreateManager } from '@/forms/createManager'
import { createTRPCRouter, protectedProcedure } from '..'

export const adminsRoutes = createTRPCRouter({
  adminMe: protectedProcedure().query(async ({ ctx }) => {
    return ctx.db.admin.findUnique({
      where: { id: ctx.session.userId },
      include: { User: true },
    })
  }),
  admins: protectedProcedure('admin').query(async ({ ctx }) => {
    return ctx.db.admin.findMany({
      include: { User: true },
    })
  }),
  create: protectedProcedure('admin')
    .input(schemaCreateManager)
    .mutation(({ ctx, input }) => {
      return ctx.db.admin.create({ data: { id: input.id } })
    }),
})
