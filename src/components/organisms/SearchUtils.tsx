'use client'
import { useHandleSearch, useKeypress } from '@/util/hooks'
import { MapPinnedIcon } from 'lucide-react'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { SimpleDialog } from './SimpleDialog'
import { LngLatBounds, useMap } from 'react-map-gl'
import { cities } from '@/util/static'
import { trpcClient } from '@/trpc/clients/client'
import { Marker } from './Map/MapMarker'
import { BrandIcon } from '../atoms/BrandIcon'
import { RouterOutputs } from '@/trpc/clients/types'

export const SetCity = () => {
  const [open, setOpen] = useState(false)

  useKeypress(['l'], () => setOpen((state) => !state))

  const { current: map } = useMap()

  return (
    <div>
      <button
        className="flex flex-col items-center gap-1"
        onClick={() => setOpen(true)}
      >
        <MapPinnedIcon />
        <div className="flex items-center justify-center w-4 h-4 border rounded shadow">
          L
        </div>
      </button>
      <SimpleDialog open={open} setOpen={setOpen} title={'Select city'}>
        <div className="grid grid-cols-3 gap-4 ">
          {cities.map((city) => (
            <button
              onClick={() => {
                map?.flyTo({
                  center: {
                    lat: city.lat,
                    lng: city.lng,
                  },
                  essential: true,
                  zoom: 10,
                })

                setOpen(false)
              }}
              className="p-3 rounded hover:shadow-2xl"
              key={city.id}
            >
              <div className="text-lg">{city.name}</div>{' '}
              <div className="text-xs text-gray-600">{city.englishName}</div>{' '}
            </button>
          ))}
        </div>
      </SimpleDialog>
    </div>
  )
}

export const DisplayCinemas = () => {
  const { current: map } = useMap()

  const [bounds, setBounds] = useState<LngLatBounds>()
  useEffect(() => {
    const bounds = map?.getBounds()
    setBounds(bounds)
  }, [map])

  const locationFilter = useMemo(
    () => ({
      ne_lat: bounds?.getNorthEast().lat || 0,
      ne_lng: bounds?.getNorthEast().lng || 0,
      sw_lat: bounds?.getSouthWest().lat || 0,
      sw_lng: bounds?.getSouthWest().lng || 0,
    }),
    [bounds],
  )

  const { data, refetch } = trpcClient.cinemas.searchCinemas.useQuery({
    addressWhere: locationFilter,
  })

  console.log('data', data)

  useEffect(() => {
    refetch()
  }, [bounds, refetch])

  return (
    <>
      {data?.map((cinema) => <MarkerCinema key={cinema.id} cinema={cinema} />)}
    </>
  )
}

export const MarkerCinema = ({
  cinema,
}: {
  cinema: RouterOutputs['cinemas']['searchCinemas'][0]
}) => {
  const { addParam } = useHandleSearch()

  if (!cinema.Address?.lat || !cinema.Address?.lng || !cinema.id) {
    return null
  }

  return (
    <Marker
      anchor="bottom"
      latitude={cinema.Address.lat}
      longitude={cinema.Address.lng}
      onClick={() => {
        addParam('cinemaId', cinema.id)
      }}
    >
      <BrandIcon className="cursor-pointer" />
      <MarkerText>{cinema.name.split(' ').slice(0, 2).join(' ')}</MarkerText>
    </Marker>
  )
}

export const MarkerText = ({ children }: { children: ReactNode }) => (
  <div className="absolute max-w-xs -translate-x-1/2 left-1/2">
    <div className="mt-1 leading-4 text-center min-w-max px-0.5 rounded backdrop-blur-sm bg-white/50">
      {children}
    </div>
  </div>
)
