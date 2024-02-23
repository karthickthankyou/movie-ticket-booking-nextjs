'use client'

import { useGetCinema, useHandleSearch } from '@/util/hooks'
import { useEffect, useState } from 'react'
import { useMap } from 'react-map-gl'
import { SimpleDialog } from '../SimpleDialog'
import { SelectMovie } from './SelectMovie'
import { SelectShowtimes } from './SelectShows'
import { SelectSeats } from './SelectSeats'

export const MovieDialog = () => {
  const { params, deleteAll } = useHandleSearch()

  const cinemaId = params.get('cinemaId')
  const movieId = params.get('movieId')
  const screenId = params.get('screenId')
  const showtimeId = params.get('showtimeId')

  const [openDialog, setOpenDialog] = useState(Boolean(cinemaId))

  const { cinema } = useGetCinema({ cinemaId })
  const { current: map } = useMap()
  useEffect(() => {
    if (cinema?.Address) {
      setOpenDialog(true)
      map?.flyTo({
        center: { lat: cinema.Address.lat, lng: cinema.Address.lng },
        zoom: 10,
      })
    } else {
      setOpenDialog(false)
    }
  }, [cinema, map])

  if (!cinema) {
    return null
  }

  return (
    <SimpleDialog
      title={cinema.name}
      open={openDialog}
      setOpen={(state) => {
        deleteAll()
        console.log('Deleing..')
        setOpenDialog(state)
      }}
    >
      <div className="space-y-8">
        <SelectMovie cinemaId={cinema.id} />

        {movieId ? (
          <SelectShowtimes
            cinemaId={cinema.id}
            movieId={+movieId}
            showtimeId={showtimeId ? +showtimeId : null}
          />
        ) : null}

        {screenId && showtimeId ? (
          <SelectSeats showtimeId={+showtimeId} screenId={+screenId} />
        ) : null}
      </div>
    </SimpleDialog>
  )
}
