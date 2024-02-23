'use client'
import { RouterOutputs } from '@/trpc/clients/types'
import { useHandleSearch } from '@/util/hooks'
import { Marker } from '../Map/MapMarker'
import { BrandIcon } from '@/components/atoms/BrandIcon'
import { ReactNode } from 'react'

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
