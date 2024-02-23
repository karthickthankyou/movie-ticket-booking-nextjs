'use client'
import { trpcClient } from '@/trpc/clients/client'
import { UserButton, useAuth } from '@clerk/nextjs'
import Link from 'next/link'

export default function Home() {
  const { userId } = useAuth()

  const { data, isLoading } = trpcClient.movies.movies.useQuery()

  console.log('data', data, isLoading)

  return (
    <main>
      {userId ? <UserButton /> : <Link href="/sign-in">Sign in</Link>}
      <div className="mt-8">
        {data?.map((movie) => (
          <div key={movie.id}>
            <div>{movie.id}</div>
            <div>{movie.title}</div>
            <div>{movie.director}</div>
          </div>
        ))}{' '}
      </div>
    </main>
  )
}
