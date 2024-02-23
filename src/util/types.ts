import { ReactNode } from 'react'

export type Role = 'admin' | 'manager'

export type BaseComponent = {
  children?: ReactNode
  className?: string
}
