import { UserButton, auth } from '@clerk/nextjs'
import Link from 'next/link'

export default function Home() {
  const { userId } = auth()
  return (
    <main>
      Hello world
      {userId ? <UserButton /> : <Link href="/sign-in">Sign in</Link>}
    </main>
  )
}
