export function nowIso() {
  return new Date().toISOString()
}

export function addDaysIso(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  next.setHours(9, 0, 0, 0)
  return next.toISOString()
}

export function formatDateTime(value?: string) {
  if (!value) {
    return 'Not scheduled'
  }

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export function toDatetimeLocalValue(value: string) {
  const date = new Date(value)
  const offset = date.getTimezoneOffset()
  const local = new Date(date.getTime() - offset * 60_000)
  return local.toISOString().slice(0, 16)
}

export function byCreatedAt(left: { createdAt: string }, right: { createdAt: string }) {
  return left.createdAt.localeCompare(right.createdAt)
}

export function byDueAt(left: { dueAt: string }, right: { dueAt: string }) {
  return left.dueAt.localeCompare(right.dueAt)
}
