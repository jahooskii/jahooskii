export const DEFAULT_TIMEZONE = 'Africa/Lagos'

export const getStoredTimeZone = () => {
  if (typeof localStorage === 'undefined') return DEFAULT_TIMEZONE
  return localStorage.getItem('quanlux-timezone') || DEFAULT_TIMEZONE
}

export const setStoredTimeZone = (timeZone: string) => {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem('quanlux-timezone', timeZone)
}

export const formatDateInTimeZone = (dateInput: string, timeZone: string) => {
  if (!dateInput) return ''
  const safeDate = dateInput.includes('T') ? new Date(dateInput) : new Date(`${dateInput}T00:00:00`)
  return new Intl.DateTimeFormat('en-NG', {
    timeZone,
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  }).format(safeDate)
}

export const formatDateTimeNow = (timeZone: string) => {
  return new Intl.DateTimeFormat('en-NG', {
    timeZone,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: 'short'
  }).format(new Date())
}

export const timeZoneOptions = [
  { value: 'Africa/Lagos', label: 'Nigeria (WAT)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Asia/Dubai', label: 'Dubai (GST)' },
  { value: 'America/New_York', label: 'New York (EST)' }
]
