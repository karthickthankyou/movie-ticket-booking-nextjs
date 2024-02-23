import Link from 'next/link'

import { AdminMenu } from '@/components/organisms/AdminMenu'
import { auth } from '@clerk/nextjs'
import { SimpleSidebar } from '@/components/molecules/SimpleSidebar'
import { trpcServer } from '@/trpc/clients/server'
import { TellThem } from '@/components/molecules/TellThem'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()

  if (!userId) {
    return <Link href="/api/auth/signin">Login</Link>
  }

  const adminMe = await trpcServer.admins.adminMe.query()

  if (!adminMe?.id) {
    return <TellThem uid={userId} role="admin" />
  }

  return (
    <div className="flex mt-2 ">
      <div className="hidden w-full max-w-xs min-w-min sm:block">
        <AdminMenu />
      </div>

      <div className="flex-grow ">
        <div className="sm:hidden">
          <SimpleSidebar>
            <AdminMenu />
          </SimpleSidebar>
        </div>
        <div className="p-4 bg-gray-100">{children}</div>
      </div>
    </div>
  )
}
