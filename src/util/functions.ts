import { RouterOutputs } from '@/trpc/clients/types'
import { format, isToday, isTomorrow } from 'date-fns'
import { seatComments } from './static'

export const random = <T>(arr: T[]) => {
  return arr[Math.floor(Math.random() * arr.length)]
}

export const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  if (isToday(date)) {
    return 'Today'
  } else if (isTomorrow(date)) {
    return 'Tomorrow'
  } else {
    return format(date, 'PPPP')
  }
}

export type PartialSeat = RouterOutputs['showtimes']['seats']['seats'][0]

export function generateSeatComment({
  allSeats,
  selectedSeats,
}: {
  allSeats: Record<number, PartialSeat[]>
  selectedSeats: PartialSeat[]
}) {
  const numberOfRows = Object.keys(allSeats).length
  const lastRow = numberOfRows
  const firstRow = 1
  const middleRow = Math.ceil(numberOfRows / 2)

  const isCorner = (seat: PartialSeat) => {
    const isFirstOrLastColumn =
      seat.column === 1 || seat.column === allSeats[seat.row].length
    return isFirstOrLastColumn
  }

  const selectedSeatsCount = selectedSeats.length

  if (selectedSeatsCount === 0) {
    return random(seatComments.zero)
  }

  if (selectedSeatsCount === 1) {
    const selectedSeat = selectedSeats[0]

    if (selectedSeat.row === lastRow) {
      return random(seatComments.lastRow)
    } else if (selectedSeat.row === firstRow) {
      return random(seatComments.firstRow)
    } else if (selectedSeat.row === middleRow) {
      return random(seatComments.middle)
    } else if (isCorner(selectedSeat)) {
      return random(seatComments.soloCorner)
    }
  } else if (selectedSeatsCount === 2) {
    const cornerSeats = selectedSeats.filter(isCorner)
    const hasCornerSeats = cornerSeats.length > 0
    const areAdjacent = (seat1: PartialSeat, seat2: PartialSeat) => {
      if (!seat1 || !seat2) {
        return false
      }

      return (
        seat1.row === seat2.row && Math.abs(seat1.column - seat2.column) === 1
      )
    }

    if (
      hasCornerSeats &&
      selectedSeatsCount === 2 &&
      areAdjacent(selectedSeats[0], selectedSeats[1])
    ) {
      return random(seatComments.couplesCorner)
    } else {
      return random(seatComments.two)
    }
  } else if (selectedSeatsCount === 3) {
    return random(seatComments.three)
  } else if (selectedSeatsCount > 3) {
    return random(seatComments.crowd)
  }

  return random(seatComments.default)
}

export const groupSeatsByRow = (
  seats: PartialSeat[],
): Record<number, PartialSeat[]> => {
  return seats.reduce(
    (acc: Record<number, PartialSeat[]>, seat: PartialSeat) => {
      if (!acc[seat.row]) {
        acc[seat.row] = []
      }
      acc[seat.row].push(seat)
      return acc
    },
    {},
  )
}
