import { RouterOutputs } from '@/trpc/clients/types'
import Image from 'next/image'

export interface ICinemaSelectCardProps {
  movie: RouterOutputs['movies']['moviesPerCinema'][0]
  selected?: boolean
}

export const CinemaSelectCard = ({
  movie,
  selected = false,
}: ICinemaSelectCardProps) => {
  return (
    <div className="flex flex-col items-start justify-start w-full gap-2 ">
      <Image
        width={200}
        height={300}
        alt={movie.title}
        src={movie.posterUrl || '/film.png'}
        className={`object-cover w-full h-48 border-2  rounded  ${
          selected ? 'shadow-xl border-primary' : 'shadow-sm border-white'
        }`}
      />
      <div className="text-sm text-left">{movie.title}</div>
    </div>
  )
}
