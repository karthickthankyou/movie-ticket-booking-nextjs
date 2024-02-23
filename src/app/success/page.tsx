import { trpcServer } from '@/trpc/clients/server'
import { redirect } from 'next/navigation'

export default async function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const sessionId = searchParams?.session_id as string

  console.log('sessionId', sessionId)
  if (!sessionId) {
    return <div>Session id missing.</div>
  }
  const ticket = await trpcServer.stripe.checkout.mutate({
    sessionId,
  })

  if (ticket?.id) {
    redirect('/user/tickets')
  }

  return <div>Success {ticket.id}</div>
}
