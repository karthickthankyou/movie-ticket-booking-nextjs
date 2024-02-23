import { useKeypress } from '@/util/hooks'
import { MapPinnedIcon } from 'lucide-react'
import { useState } from 'react'
import { SimpleDialog } from '../SimpleDialog'
import { cities } from '@/util/static'
import { useMap } from 'react-map-gl'

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
