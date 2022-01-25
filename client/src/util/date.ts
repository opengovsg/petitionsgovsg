import { formatDuration, intervalToDuration, parseJSON } from 'date-fns'

type HasCreatedAt = {
  createdAt: Date | string | number
}

export const sortByCreatedAt = (a: HasCreatedAt, b: HasCreatedAt): number =>
  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()

export const getDateDistance = (dateString: string): string => {
  const DAYS_TO_ADD = 179
  const dateObj = parseJSON(dateString)
  const futureDateObj = dateObj.setDate(dateObj.getDate() + DAYS_TO_ADD)
  const dateInterval = intervalToDuration({
    start: futureDateObj,
    end: new Date(),
  })
  return formatDuration(dateInterval, {
    format: ['months', 'days'],
    delimiter: ', ',
  })
}
