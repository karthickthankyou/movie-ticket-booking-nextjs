import { ReactNode } from 'react'

export type Role = 'admin' | 'manager'

export type BaseComponent = {
  children?: ReactNode
  className?: string
}

export type StripeItemType = {
  screenId: number
  showtimeId: number
  seats: { column: number; row: number; price: number }[]
}
