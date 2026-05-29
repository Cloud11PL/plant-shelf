import type { Plant, Reminder, Shelf, WateringTarget } from '../types/domain'

export function reminderStatus(dueAt?: string) {
  if (!dueAt) {
    return 'No reminder'
  }

  const diffHours = (new Date(dueAt).getTime() - Date.now()) / 3_600_000

  if (diffHours < 0) {
    return 'Overdue'
  }
  if (diffHours <= 4) {
    return 'Due now'
  }
  if (diffHours <= 24) {
    return 'Due soon'
  }

  return 'OK'
}

export function statusClass(dueAt: string) {
  const status = reminderStatus(dueAt)

  if (status === 'OK') {
    return 'text-[#4f6b2f]'
  }
  if (status === 'Due soon' || status === 'Due now') {
    return 'text-[#a95a2e]'
  }
  if (status === 'Overdue') {
    return 'text-[#a44a3f]'
  }

  return 'text-[#775149]'
}

export function toWateringTargets(shelves: Shelf[], plants: Plant[]): WateringTarget[] {
  return [
    ...shelves.map(shelfToTarget),
    ...plants.map((plant) => {
      const shelf = shelves.find((item) => item.id === plant.shelfId)
      return plantToTarget(plant, shelf)
    }),
  ]
}

export function shelfToTarget(shelf: Shelf): WateringTarget {
  return {
    id: shelf.id,
    type: 'shelf',
    name: shelf.name,
    photoId: shelf.photoId,
    intervalDays: shelf.wateringIntervalDays,
    nextReminderAt: shelf.nextReminderAt,
  }
}

export function plantToTarget(plant: Plant, shelf?: Shelf): WateringTarget {
  return {
    id: plant.id,
    type: 'plant',
    name: plant.name,
    shelfName: shelf?.name,
    photoId: plant.photoId,
    intervalDays: plant.wateringIntervalDays ?? shelf?.wateringIntervalDays,
    nextReminderAt: plant.nextReminderAt,
  }
}

export function targetLabel(reminder: Reminder, targets: WateringTarget[]) {
  const target = targets.find((item) => item.id === reminder.targetId && item.type === reminder.targetType)
  return target?.shelfName ? `${target.name} (${target.shelfName})` : target?.name
}

export function parseOptionalNumber(value: string) {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined
}

export function labelPredictionSource(source: 'history' | 'targetInterval' | 'shelfDefault' | 'manual') {
  if (source === 'history') {
    return 'watering history'
  }
  if (source === 'targetInterval') {
    return 'target interval'
  }
  if (source === 'shelfDefault') {
    return 'shelf default'
  }

  return 'fallback rhythm'
}
