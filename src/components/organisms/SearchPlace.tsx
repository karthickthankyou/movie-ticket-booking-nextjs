'use client'

import { Loader } from 'lucide-react'
import * as React from 'react'

import { useMap } from 'react-map-gl'
import { Input } from '../atoms/input'
import { ViewState } from '../organisms/Map/Map'
import { useSearchLocation } from '@/util/hooks'

export function SearchPlace({
  onLocationChange,
}: {
  onLocationChange?: (location: ViewState) => void
}) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState('')

  const { loading, setSearchText, locationInfo } = useSearchLocation()

  React.useEffect(() => {
    setSearchText(value)
  }, [setSearchText, value])

  const { current: map } = useMap()

  return (
    <div className="relative">
      <Input
        placeholder="Search place..."
        value={value}
        onChange={(e) => {
          setOpen(e.target.value.length > 0)
          setValue(e.target.value)
        }}
      />
      {open ? (
        <div className="bg-background">
          {loading && <Loader />}
          <div className="absolute z-10 top-full">
            {locationInfo.map((place) => (
              <button
                className="block w-full p-2 text-left underline underline-offset-4 hover:font-bold"
                key={place.placeName}
                onClick={() => {
                  const {
                    latLng: [latitude, longitude],
                  } = place
                  if (onLocationChange) {
                    onLocationChange({ latitude, longitude, zoom: 10 })
                  }
                  setOpen(false)
                  setValue('')
                  map?.flyTo({
                    center: { lat: latitude, lng: longitude },
                    essential: true,
                  })
                }}
              >
                {place.placeName}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
