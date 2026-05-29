import type { Shelf, WateringEvent, WateringTarget } from '../types/domain'
import { addDaysIso } from '../utils/dates'

export const predictionService = {
  suggest(target: WateringTarget, events: WateringEvent[], shelf?: Shelf) {
    const targetEvents = events
      .filter((event) => event.targetType === target.type && event.targetId === target.id)
      .sort((a, b) => a.wateredAt.localeCompare(b.wateredAt))
      .slice(-4)

    const historicalIntervals = targetEvents
      .slice(1)
      .map((event, index) => {
        const previous = new Date(targetEvents[index].wateredAt).getTime()
        const current = new Date(event.wateredAt).getTime()
        return Math.round((current - previous) / 86_400_000)
      })
      .filter((days) => days > 0)

    if (historicalIntervals.length > 0) {
      const average = Math.max(1, Math.round(
        historicalIntervals.reduce((sum, days) => sum + days, 0) / historicalIntervals.length,
      ))

      return {
        days: average,
        source: 'history' as const,
        dueAt: addDaysIso(new Date(), average),
      }
    }

    if (target.intervalDays) {
      return {
        days: target.intervalDays,
        source: 'targetInterval' as const,
        dueAt: addDaysIso(new Date(), target.intervalDays),
      }
    }

    if (shelf?.wateringIntervalDays) {
      return {
        days: shelf.wateringIntervalDays,
        source: 'shelfDefault' as const,
        dueAt: addDaysIso(new Date(), shelf.wateringIntervalDays),
      }
    }

    return {
      days: 7,
      source: 'manual' as const,
      dueAt: addDaysIso(new Date(), 7),
    }
  },
}
