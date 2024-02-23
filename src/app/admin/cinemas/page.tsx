import { ListCinemas } from '@/components/templates/ListCinemas'
import { trpcServer } from '@/trpc/clients/server'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default async function Page() {
  const cinemas = await trpcServer.cinemas.cinemas.query({})

  return (
    <main>
      <div className="flex justify-end">
        <Link
          href={'/admin/cinemas/new'}
          className="flex items-center gap-2 my-2"
        >
          <Plus /> Create cinema
        </Link>
      </div>
      <ListCinemas cinemas={cinemas} />
    </main>
  )
}
