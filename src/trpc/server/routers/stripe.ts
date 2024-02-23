import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '..'
import { stripe } from '@/db/stripe'
import { TRPCError } from '@trpc/server'
import { firebaseUpload } from '@/util/storage/upload'
import * as bwipjs from 'bwip-js'
import { format } from 'date-fns'

const paymentSchema = z.object({
  userId: z.string(),
  screenId: z.number(),
  showtimeId: z.number(),
  price: z.number(),
  seats: z.array(z.object({ column: z.number(), row: z.number() })),
})

export const stripeRoutes = createTRPCRouter({
  createSession: protectedProcedure()
    .input(paymentSchema)
    .mutation(async ({ ctx, input }) => {
      const { price, screenId, seats, showtimeId } = input
      const {
        session: { userId },
      } = ctx
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: seats.map(({ column, row }) => ({
          quantity: 1,
          price_data: {
            product_data: {
              name: `${row} - ${column}`,
            },
            currency: 'inr',
            unit_amount: price * 100,
          },
        })),
        mode: 'payment',
        success_url: process.env.STRIPE_SUCCESS_URL,
        cancel_url: process.env.STRIPE_CANCEL_URL,
        metadata: {
          bookingInfo: JSON.stringify({
            seats,
            screenId,
            showtimeId,
            userId,
            price,
          }),
        },
      })
      return { sessionId: session.id }
    }),
  checkout: protectedProcedure()
    .input(z.object({ sessionId: z.string() }))
    .mutation(async ({ ctx, input: { sessionId } }) => {
      const session = await stripe.checkout.sessions.retrieve(sessionId)

      const bookingInfo = session.metadata?.bookingInfo
      const uid = session.metadata?.uid

      if (!bookingInfo) {
        throw new TRPCError({
          message: 'Payload missing',
          code: 'UNPROCESSABLE_CONTENT',
        })
      }

      console.log('session.metadata', session.metadata)
      const parsedBookingInfo = paymentSchema
        .omit({ price: true })
        .safeParse(JSON.parse(bookingInfo))

      if (parsedBookingInfo.success) {
        const {
          data: { seats, screenId, showtimeId, userId },
        } = parsedBookingInfo

        const ticket = await ctx.db.ticket.create({
          data: {
            uid: userId,
            Bookings: {
              create: seats.map((seat) => ({
                row: seat.row,
                column: seat.column,
                screenId,
                showtimeId,
                userId,
              })),
            },
          },
          include: {
            Bookings: {
              include: {
                Seat: true,
                Showtime: true,
              },
            },
          },
        })

        const qrData = {
          userId: ticket.uid,
          ticketId: ticket.id,
          seats: ticket.Bookings.map(
            (booking) => `${booking.Seat.row}-${booking.Seat.column}`,
          ),
          time: format(new Date(ticket.Bookings[0].Showtime.startTime), 'PPp'),
        }

        const png = await bwipjs.toBuffer({
          bcid: 'qrcode', // Barcode type
          text: JSON.stringify(qrData), // Text to encode
          textxalign: 'center', // Align the text to the center
        })

        const qrCode = await firebaseUpload(png, userId, ticket.id)
        const updatedTicket = await ctx.db.ticket.update({
          where: { id: ticket.id },
          data: { qrCode },
        })

        return updatedTicket
      } else {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: JSON.stringify(parsedBookingInfo.error.errors),
        })
      }
    }),
})
