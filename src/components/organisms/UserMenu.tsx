import { Link } from '../molecules/CustomLink'

export const UserMenu = () => {
  return (
    <div className="flex flex-col w-full max-w-xs gap-2">
      <Link href="/user">Dashboard</Link>
      <Link href="/user/tickets">Tickets</Link>
    </div>
  )
}
