import type { EntityId, Plant, Reminder, Shelf } from '../types/domain'
import { nowIso } from '../utils/dates'
import { createId } from '../utils/ids'
import { deleteRecord, putRecord, STORES } from '../storage/indexedDb'

export const shelfService = {
  async create(input: { name: string; wateringIntervalDays?: number; photoId?: EntityId }) {
    const createdAt = nowIso()
    const shelf: Shelf = {
      id: createId(),
      name: input.name.trim(),
      photoId: input.photoId,
      wateringIntervalDays: input.wateringIntervalDays,
      createdAt,
      updatedAt: createdAt,
    }

    await putRecord(STORES.shelves, shelf)
    return shelf
  },

  async update(current: Shelf, input: { name: string; wateringIntervalDays?: number; photoId?: EntityId }) {
    const shelf: Shelf = {
      ...current,
      name: input.name.trim(),
      photoId: input.photoId ?? current.photoId,
      wateringIntervalDays: input.wateringIntervalDays,
      updatedAt: nowIso(),
    }

    await putRecord(STORES.shelves, shelf)
    return shelf
  },

  async remove(shelf: Shelf, plants: Plant[], reminders: Reminder[]) {
    await Promise.all([
      deleteRecord(STORES.shelves, shelf.id),
      ...plants.filter((plant) => plant.shelfId === shelf.id).map((plant) => deleteRecord(STORES.plants, plant.id)),
      ...reminders
        .filter((reminder) => reminder.targetType === 'shelf' && reminder.targetId === shelf.id)
        .map((reminder) => deleteRecord(STORES.reminders, reminder.id)),
    ])
  },
}
