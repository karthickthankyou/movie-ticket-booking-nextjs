'use client'
import { loadStripe } from '@stripe/stripe-js'
import { StripeItemType } from '@/util/types'

import { generateSeatComment, groupSeatsByRow } from '@/util/functions'

import { Button } from '../../atoms/button'
import { Loading } from '../../molecules/Loading'
import { trpcClient } from '@/trpc/clients/client'
import { useSeatSelection } from '@/util/hooks'
import { useAuth } from '@clerk/nextjs'
import { Square, StaightMovieScreen } from '../ScreenUtils'
import { SeatNumber } from './SeatNumber'

export interface ISelectSeatsProps {}

export const SelectSeats = ({
  showtimeId,
  screenId,
}: {
  showtimeId: number
  screenId: number
}) => {
  console.log('showtimeId', showtimeId)
  const { data, isLoading } = trpcClient.showtimes.seats.useQuery({
    showtimeId,
  })

  console.log(`

    data?.seats: ${JSON.stringify(data?.seats)}

    `)

  const rows = groupSeatsByRow(data?.seats || []) || []

  const {
    state: { selectedSeats },
    toggleSeat,
    resetSeats,
  } = useSeatSelection()

  const { userId } = useAuth()

  const { mutateAsync: createStripeSession } =
    trpcClient.stripe.createSession.useMutation()

  if (!showtimeId || !userId) return null

  return (
    <div>
      <div>
        <StaightMovieScreen />
        {isLoading ? <Loading /> : null}
        <div className="flex justify-center overflow-x-auto py-2">
          <div>
            {Object.entries(rows).map(([rowNumber, seatsInRow]) => (
              <div key={rowNumber} className="flex gap-2 mt-1">
                {seatsInRow.map((seat) => (
                  <button
                    key={`${seat.row}-${seat.column}`}
                    disabled={Boolean(seat?.booked)}
                    onClick={() => {
                      toggleSeat(seat)
                    }}
                  >
                    <Square
                      key={`${seat.row}-${seat.column}`}
                      booked={Boolean(seat?.booked)}
                      selected={Boolean(
                        selectedSeats?.find(
                          (selectedSeat) =>
                            seat.column === selectedSeat.column &&
                            seat.row === selectedSeat.row,
                        ),
                      )}
                    />
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="py-4">
        <div className="text-lg font-light">
          {generateSeatComment({ allSeats: rows, selectedSeats })}
        </div>

        {selectedSeats.length ? (
          <div className="my-4">
            <div>Seats</div>
            <div className="flex flex-wrap gap-2">
              {selectedSeats.map(({ row, column }) => (
                <SeatNumber
                  key={`${row}-${column}`}
                  row={row}
                  column={column}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex justify-between mt-4">
        <Button onClick={() => resetSeats()} variant="destructive" size="sm">
          Reset
        </Button>

        {selectedSeats.length ? (
          <Button
            onClick={async () => {
              const seats = selectedSeats.map(({ column, row }) => ({
                row,
                column,
                price: data?.price || 0,
              }))

              const stripeSession = await createStripeSession({
                screenId,
                seats,
                showtimeId,
                price: data?.price || 0,
                userId,
              })

              console.log('checkoutSession', data)

              const publishableKey =
                process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

              const stripePromise = loadStripe(publishableKey || '')
              const stripe = await stripePromise

              const result = await stripe?.redirectToCheckout({
                sessionId: stripeSession.sessionId,
              })

              return result

              resetSeats()
            }}
          >
            Create booking
          </Button>
        ) : null}
      </div>
    </div>
  )
}

export const createPaymentSession = async (
  uid: string,
  bookingInfo: StripeItemType,
) => {}
