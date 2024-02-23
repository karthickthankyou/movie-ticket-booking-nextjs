import { format, isToday, isTomorrow } from 'date-fns'

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
