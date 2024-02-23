import { format } from 'date-fns'

import { ShowRemainingSeats } from './ShowRemainingSeats'
import { RouterOutputs } from '@/trpc/clients/types'

export interface IShowtimeSelectCardProps {
  showtime: RouterOutputs['showtimes']['showtimesPerCinema'][number]['showtimes'][number]
  selected?: boolean
}

export const ShowtimeSelectCard = ({
  showtime,
  selected = false,
}: IShowtimeSelectCardProps) => {
  console.log('Start time ', showtime.startTime)
  return (
    <div
      className={`flex border p-1 rounded flex-col items-start ${
        selected ? 'shadow-lg border-primary shadow-black/30' : ''
      }`}
    >
      <div className="text-sm font-bold">
        {format(new Date(showtime.startTime), 'p')}
      </div>
      <div className="text-sm">Rs.{showtime.Screen.price}</div>
      <div className="text-xs ">{showtime.Screen.projectionType}</div>
      <div className="text-xs ">{showtime.Screen.soundSystemType}</div>
      <ShowRemainingSeats showtimeId={showtime.id} />
    </div>
  )
}
