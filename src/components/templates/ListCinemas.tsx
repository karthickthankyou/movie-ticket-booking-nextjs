'use client'
import Image from 'next/image'
import { Title2 } from '../atoms/typography'
import { format } from 'date-fns'
import { AlertBox } from '../molecules/AlertBox'
import { RouterOutputs } from '@/trpc/clients/types'
import { trpcClient } from '@/trpc/clients/client'
import { formatDate } from '@/util/functions'

export interface IListMoviesProps {
  cinemas: RouterOutputs['cinemas']['cinemas']
}

export const ListCinemas = ({ cinemas }: IListMoviesProps) => {
  return (
    <div>
      <div>
        {cinemas.length === 0 ? (
          <div>You have not created any cinemas yet.</div>
        ) : null}
      </div>

      <div className="flex flex-col gap-3">
        {cinemas.map((cinema) => (
          <CinemaInfo key={cinema.id} cinema={cinema} />
        ))}
      </div>
    </div>
  )
}

export const CinemaInfo = ({
  cinema,
}: {
  cinema: RouterOutputs['cinemas']['cinemas'][0]
}) => {
  return (
    <div>
      <div className="text-2xl font-semibold">{cinema.name}</div>
      <div className="text-sm text-gray-600 mt-2">
        Screens: {cinema.Screens.length}
      </div>
      <div className="flex flex-col gap-4 mt-8">
        {cinema.Screens.map((screen) => (
          <div key={screen.id}>
            <div className="font-light text-xl ">Screen {screen.number}</div>

            {screen.Showtimes.length === 0 ? (
              <AlertBox>
                <div>No shows found.</div>
              </AlertBox>
            ) : null}
            <ShowScreenShowtimes screenId={screen.id} />
          </div>
        ))}
      </div>
    </div>
  )
}

export const ShowScreenShowtimes = ({ screenId }: { screenId: number }) => {
  const { data, isLoading } = trpcClient.showtimes.showtimesPerScreen.useQuery({
    screenId,
  })

  return data?.map((date) => (
    <div key={date.date}>
      <div className="my-8">
        <div className="mb-2 text-lg font-semibold">
          {formatDate(date.date)}
        </div>
        <div className="grid grid-cols-3 gap-2 ">
          {[...date.showtimes]
            .sort(
              (a, b) =>
                new Date(a.startTime).getTime() -
                new Date(b.startTime).getTime(),
            )
            .map((showtime) => (
              <div className="p-3 border rounded" key={showtime.id}>
                <div className="font-semibold text-2xl">
                  {format(showtime.startTime.toString(), 'p')}
                </div>
                <div className="text-gray-600 text-xs mb-2">
                  {format(showtime.startTime.toString(), 'PP')}
                </div>
                <Image
                  src={showtime.Movie.posterUrl || '/film.png'}
                  alt=""
                  className="rounded-lg"
                  width={300}
                  height={300}
                />
                <Title2 className="mt-2">{showtime.Movie.title}</Title2>
              </div>
            ))}
        </div>
      </div>
    </div>
  ))
}
