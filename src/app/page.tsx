'use client'
import { UserInfo } from '@/components/UserInfo'
import { trpcClient } from '@/trpc/clients/client'
import { UserButton, auth, useAuth } from '@clerk/nextjs'
import Link from 'next/link'

export default function Home() {
  const { userId } = useAuth()

  const { data, isLoading } = trpcClient.allUsers.useQuery()

  console.log('data', data, isLoading)

  return (
    <main>
      Hello world
      {userId ? <UserButton /> : <Link href="/sign-in">Sign in</Link>}
      <div className="mt-8">
        {data?.map((user) => <UserInfo key={user.id} user={user} />)}{' '}
      </div>
    </main>
  )
}
