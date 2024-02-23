import { Title2 } from '@/components/atoms/typography'
import { CreateAdmin } from '@/components/organisms/CreateAdmin'

import { UserCard } from '@/components/organisms/UserCard'
import { trpcServer } from '@/trpc/clients/server'

export default async function ManageAdmins() {
  const admins = await trpcServer.admins.admins.query()

  return (
    <div>
      <div className="flex justify-between gap-2">
        <div>Manage Admins</div>
      </div>
      <CreateAdmin />
      <div className="mt-6">
        <Title2>Admins</Title2>
        <div className="grid grid-cols-3 gap-3">
          {admins?.map((admin) => (
            <UserCard key={admin.id} user={admin.User} />
          ))}
        </div>
      </div>
    </div>
  )
}
