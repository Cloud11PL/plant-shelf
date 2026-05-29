import type { RelativeReminderValue } from '../types/ui'
import { toDatetimeLocalValue } from './dates'

const relativeReminderMs: Record<Exclude<RelativeReminderValue, 'custom'>, number> = {
  '5h': 5 * 60 * 60 * 1000,
  '1d': 24 * 60 * 60 * 1000,
  '3d': 3 * 24 * 60 * 60 * 1000,
  '7d': 7 * 24 * 60 * 60 * 1000,
  '14d': 14 * 24 * 60 * 60 * 1000,
}

export function nextReminderIsoFromRelative(value: RelativeReminderValue, customDateTime: string) {
  if (value === 'custom') {
    return new Date(customDateTime).toISOString()
  }

  return new Date(Date.now() + relativeReminderMs[value]).toISOString()
}

export function relativeValueFromSuggestion(days: number): RelativeReminderValue {
  if (days <= 1) {
    return '1d'
  }
  if (days <= 3) {
    return '3d'
  }
  if (days <= 7) {
    return '7d'
  }
  if (days <= 14) {
    return '14d'
  }

  return 'custom'
}

export function fallbackCustomReminderValue() {
  return toDatetimeLocalValue(new Date(Date.now() + relativeReminderMs['7d']).toISOString())
}
