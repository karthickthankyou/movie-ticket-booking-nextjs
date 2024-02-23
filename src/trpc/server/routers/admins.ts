import { createTRPCRouter, protectedProcedure } from '..'

export const adminsRoutes = createTRPCRouter({
  adminMe: protectedProcedure().query(async ({ ctx }) => {
    return ctx.db.admin.findUnique({
      where: { id: ctx.session.userId },
      include: { User: true },
    })
  }),
})
