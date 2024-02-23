import { trpcClient } from '@/trpc/clients/client'
import { Armchair } from 'lucide-react'

export const ShowRemainingSeats = ({ showtimeId }: { showtimeId: number }) => {
  const { data } = trpcClient.showtimes.seatsInfo.useQuery({
    showtimeId,
  })

  const totalSeats = data?.total || 0
  const bookedSeats = data?.booked || 0
  const remainingSeats = totalSeats - bookedSeats
  return (
    <div className="text-xs mt-2">
      {remainingSeats}/{totalSeats} <Armchair className="inline w-4 h-4" />
    </div>
  )
}
