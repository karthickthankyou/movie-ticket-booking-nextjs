import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server'
import { AppRouter } from '../server/routers'

export type RouterInputs = inferRouterInputs<AppRouter>
export type RouterOutputs = inferRouterOutputs<AppRouter>
