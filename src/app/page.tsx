import { trpcServer } from '@/trpc/clients/server'
import { UserButton, auth } from '@clerk/nextjs'
import Link from 'next/link'

export default async function Home() {
  const { userId } = auth()

  const users = await trpcServer.allUsers.query()

  return (
    <main>
      Hello world
      {userId ? <UserButton /> : <Link href="/sign-in">Sign in</Link>}
      <div className="mt-8">
        {users.map((user) => (
          <div key={user.id} className="p-2">
            <div>{user.id}</div>
            <div>{user.name}</div>
            <div>{user.image}</div>
          </div>
        ))}{' '}
      </div>
    </main>
  )
}
