import { Plus } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { trpcServer } from '@/trpc/clients/server'
import { RouterOutputs } from '@/trpc/clients/types'

export interface IListMoviesProps {}

export const ListMovies = async ({}: IListMoviesProps) => {
  const movies = await trpcServer.movies.movies.query()

  return (
    <div>
      <div className="flex justify-end">
        <Link
          href={'/admin/movies/new'}
          className="flex items-center gap-2 my-2"
        >
          <Plus /> Create movie
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {movies.map((movie) => (
          <MovieInfo key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  )
}

export const MovieInfo = ({
  movie,
}: {
  movie: RouterOutputs['movies']['movies'][0]
}) => {
  return (
    <div>
      <Image
        src={movie.posterUrl || '/film.png'}
        alt=""
        className="aspect-square object-cover rounded shadow-lg"
        width={300}
        height={300}
      />
      <div className="text-lg font-semibold">{movie.title}</div>
      <div>{movie.director}</div>
      <div className="text-xs text-gray-500 mt-2">{movie.genre}</div>
    </div>
  )
}
