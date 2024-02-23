'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useReducer, useRef, useState } from 'react'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { storage } from '../config/firebase'
import { catchError, debounceTime, EMPTY, Subject, tap } from 'rxjs'
import { trpcClient } from '@/trpc/clients/client'
import { RouterOutputs } from '@/trpc/clients/types'

export const useDialogState = (defaultState = false) => {
  const [open, setOpen] = useState(defaultState)
  const pathname = usePathname()
  const initialPathname = useRef(pathname)

  useEffect(() => {
    if (pathname !== initialPathname.current) {
      setOpen(false)
      initialPathname.current = pathname
    }
  }, [pathname, open])

  return [open, setOpen] as const
}

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false)
  const [percent, setPercent] = useState(0)

  const handleUpload = async (files: any): Promise<string[]> => {
    if (!files?.length) {
      return []
    }

    setUploading(true)

    const uploadTasks = Array.from(files).map((file: any) => {
      const storageRef = ref(storage, `/files/${file.name}`)
      const uploadTask = uploadBytesResumable(storageRef, file)

      return new Promise<string>((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const percent = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
            )
            setPercent(percent)
          },
          reject,
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(resolve).catch(reject)
          },
        )
      })
    })

    try {
      const imageUrls = await Promise.all(uploadTasks)

      setUploading(false)
      return imageUrls
    } catch (err) {
      console.log(err)
      setUploading(false)
      return []
    }
  }

  return [{ uploading, percent }, handleUpload] as const
}

/**
 * Debounce
 */

export const useDebounce = (delay: number = 1000) => {
  const [debouncedSet$] = useState(() => new Subject<() => void>())
  useEffect(() => {
    const subscription = debouncedSet$
      .pipe(
        debounceTime(delay),
        tap((func) => func()),
        catchError(() => EMPTY),
      )
      .subscribe()
    return () => subscription.unsubscribe()
  }, [delay, debouncedSet$])

  return debouncedSet$
}

export const useDebouncedValue = <T>(value: T, delay: number = 1000) => {
  const [debouncedValue, setDebouncedValue] = useState(value)
  const debouncedSet$ = useDebounce(delay)

  useEffect(() => {
    debouncedSet$.next(() => setDebouncedValue(value))
  }, [debouncedSet$, value])

  return debouncedValue
}

export type LocationInfo = { placeName: string; latLng: [number, number] }

export const useSearchLocation = () => {
  const [searchText, setSearchText] = useState('')
  const [loading, setLoading] = useState(false)
  const [locationInfo, setLocationInfo] = useState<LocationInfo[]>(() => [])

  const debouncedSearchText = useDebouncedValue(searchText, 300)

  useEffect(() => {
    setLoading(true)
    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${debouncedSearchText}.json?fuzzyMatch=true&access_token=pk.eyJ1IjoiaWFta2FydGhpY2siLCJhIjoiY2t4b3AwNjZ0MGtkczJub2VqMDZ6OWNrYSJ9.-FMKkHQHvHUeDEvxz2RJWQ`,
    )
      .then((response) => response.json())
      .then((data) => {
        const filtered = data.features?.map((x: any) => ({
          placeName: x.place_name,
          latLng: [x.center[1], x.center[0]],
        }))

        setLocationInfo(filtered)
      })
      .finally(() => setLoading(false))
  }, [debouncedSearchText, setLocationInfo])

  return { loading, setLoading, searchText, setSearchText, locationInfo }
}

export const useKeypress = (keys: string[], action?: Function) => {
  useEffect(() => {
    const onKeyup = (e: { key: any }) => {
      if (keys.includes(e.key) && action) action()
    }
    window.addEventListener('keyup', onKeyup)
    return () => window.removeEventListener('keyup', onKeyup)
  }, [action, keys])
}

export const useHandleSearch = () => {
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams)
  const pathname = usePathname()
  const router = useRouter()

  const addParam = (key: string, value: string | number) => {
    params.set(key, value.toString())
    router.replace(`${pathname}?${params}`)
  }

  const deleteParam = (key: string) => {
    params.delete(key)
    console.log('delete:params', params.toString())
  }

  const deleteAll = () => {
    router.replace('/cinemas')

    console.log('deleteAll:params', params.toString())
  }

  return { params, addParam, deleteParam, deleteAll }
}

/**
 * Get current cinema
 */

export function useGetCinema({ cinemaId }: { cinemaId: string | null }) {
  const { data, refetch } = trpcClient.cinemas.cinema.useQuery(
    { cinemaId: +(cinemaId || '') },
    { enabled: false },
  )

  useEffect(() => {
    if (cinemaId) {
      refetch()
    }
  }, [refetch, cinemaId])

  console.log('data ', data)

  return { cinema: data }
}

type SeatRowcolumn = RouterOutputs['showtimes']['seats']['seats'][0]

type State = {
  selectedSeats: SeatRowcolumn[]
}

type ToggleAction = {
  type: 'toggleSeat'
  payload: SeatRowcolumn
}
type ResetAction = {
  type: 'reset'
}
type Action = ToggleAction | ResetAction

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'toggleSeat': {
      const existingSelection = state.selectedSeats.find(
        (selectedSeat) =>
          action.payload?.column === selectedSeat.column &&
          action.payload?.row === selectedSeat.row,
      )

      if (existingSelection) {
        return {
          ...state,
          selectedSeats: state.selectedSeats.filter(
            (seat) =>
              !(
                seat.column === action.payload.column &&
                seat.row === action.payload.row
              ),
          ),
        }
      } else {
        return {
          ...state,
          selectedSeats: [...state.selectedSeats, action.payload],
        }
      }
    }
    case 'reset': {
      return {
        ...state,
        selectedSeats: [],
      }
    }
    default:
      return state
  }
}

export const useSeatSelection = () => {
  const [state, dispatch] = useReducer(reducer, { selectedSeats: [] })

  const toggleSeat = (seat: SeatRowcolumn) => {
    dispatch({ type: 'toggleSeat', payload: seat })
  }
  const resetSeats = () => {
    dispatch({ type: 'reset' })
  }
  return { state, toggleSeat, resetSeats }
}
