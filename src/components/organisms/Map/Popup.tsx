import { X } from 'lucide-react'
import { Popup, PopupProps } from 'react-map-gl'

const MapPopup = ({ latitude, longitude, children }: PopupProps) => {
  return (
    <Popup latitude={latitude} longitude={longitude} closeButton={false}>
      <div className="grid grid-cols-1 grid-rows-1">
        <div className="col-start-1 row-start-1 ">{children}</div>
        <div className="flex justify-end col-start-1 row-start-1 p-2 items-top">
          <button
            type="button"
            className="absolute top-0 right-0 p-0.5 rounded-bl bg-black/30 hover:bg-black/40"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </Popup>
  )
}

export { MapPopup as Popup }
