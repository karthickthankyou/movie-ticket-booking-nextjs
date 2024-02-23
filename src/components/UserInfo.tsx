import { RouterOutputs } from '@/trpc/clients/types'

export const UserInfo = ({ user }: { user: RouterOutputs['allUsers'][0] }) => {
  return (
    <div>
      <div>{user.id}</div>
      <div>{user.name}</div>
    </div>
  )
}
