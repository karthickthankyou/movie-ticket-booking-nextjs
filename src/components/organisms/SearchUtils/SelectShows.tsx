import { Loading } from '@/components/molecules/Loading'
import { trpcClient } from '@/trpc/clients/client'
import { formatDate, random } from '@/util/functions'
import { useHandleSearch } from '@/util/hooks'
import { noShowsMessages } from '@/util/static'
import { Box } from 'lucide-react'
import { ShowtimeSelectCard } from './ShowtimeSelectCard'

export const SelectShowtimes = ({
  cinemaId,
  movieId,
  showtimeId,
}: {
  cinemaId: number
  movieId: number
  showtimeId?: number | null
}) => {
  const { addParam } = useHandleSearch()

  const { data, isLoading } = trpcClient.showtimes.showtimesPerCinema.useQuery({
    cinemaId,
    movieId,
  })

  return (
    <div>
      <div>Select showtime</div>
      {isLoading ? <Loading /> : null}

      <div className="flex flex-col gap-4 ">
        {data?.length === 0 ? (
          <>
            <div className="flex flex-col items-center justify-center w-full text-gray-800 rounded h-36 bg-gray-50">
              <div className="flex items-center gap-1 text-lg font-semibold">
                <Box />
                <div>No shows.</div>
              </div>
              <div className="max-w-xs text-sm text-center">
                {random(noShowsMessages)}
              </div>
            </div>
          </>
        ) : null}
        {data?.map((date) => (
          <div key={date.date} className="w-full">
            <div className="mb-2 text-lg font-semibold">
              {formatDate(date.date)}
            </div>
            <div className="grid grid-cols-3 gap-2 ">
              {[...date.showtimes]
                .sort((a, b) => {
                  console.log('a, b', a.startTime, b.startTime)
                  return (
                    new Date(a.startTime).getTime() -
                    new Date(b.startTime).getTime()
                  )
                })
                .map((showtime) => (
                  <button
                    key={showtime.id}
                    onClick={() => {
                      addParam('showtimeId', showtime.id)
                      addParam('screenId', showtime.screenId)
                    }}
                  >
                    <ShowtimeSelectCard
                      selected={showtime.id === showtimeId}
                      key={showtime.id}
                      showtime={showtime}
                    />
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
