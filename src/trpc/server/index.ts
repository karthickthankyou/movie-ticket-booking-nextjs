import { auth } from '@clerk/nextjs'
import { prisma } from '@/db/prisma'
import { TRPCError, initTRPC } from '@trpc/server'
import { authorizeUser } from './util'
import { Role } from '@/util/types'

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = auth()

  return {
    db: prisma,
    session,
    ...opts,
  }
}

const t = initTRPC.context<typeof createTRPCContext>().create()

export const createTRPCRouter = t.router

export const publicProcedure = t.procedure

export const protectedProcedure = (...roles: Role[]) =>
  t.procedure.use(async ({ ctx, next }) => {
    if (!ctx.session || !ctx.session.userId) {
      throw new TRPCError({ code: 'UNAUTHORIZED' })
    }

    await authorizeUser(ctx.session.userId, roles)

    return next({
      ctx: {
        session: { ...ctx.session, user: ctx.session.user },
      },
    })
  })
