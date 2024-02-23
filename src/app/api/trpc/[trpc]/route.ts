import { createTRPCContext } from '@/trpc/server'
import { appRouter } from '@/trpc/server/routers'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { type NextRequest } from 'next/server'

const createContext = async (req: NextRequest) => {
  return createTRPCContext({
    headers: req.headers,
  })
}

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => createContext(req),
  })

export { handler as GET, handler as POST }
