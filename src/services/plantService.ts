import type { EntityId, Plant, Reminder } from '../types/domain'
import { nowIso } from '../utils/dates'
import { createId } from '../utils/ids'
import { deleteRecord, putRecord, STORES } from '../storage/indexedDb'

export const plantService = {
  async create(input: {
    shelfId: EntityId
    name: string
    species?: string
    note?: string
    wateringIntervalDays?: number
    photoId?: EntityId
  }) {
    const createdAt = nowIso()
    const plant: Plant = {
      id: createId(),
      shelfId: input.shelfId,
      name: input.name.trim(),
      species: input.species?.trim() || undefined,
      note: input.note?.trim() || undefined,
      photoId: input.photoId,
      wateringIntervalDays: input.wateringIntervalDays,
      createdAt,
      updatedAt: createdAt,
    }

    await putRecord(STORES.plants, plant)
    return plant
  },

  async update(current: Plant, input: {
    shelfId?: EntityId
    name: string
    species?: string
    note?: string
    wateringIntervalDays?: number
    photoId?: EntityId
  }) {
    const plant: Plant = {
      ...current,
      shelfId: input.shelfId ?? current.shelfId,
      name: input.name.trim(),
      species: input.species?.trim() || undefined,
      note: input.note?.trim() || undefined,
      photoId: input.photoId ?? current.photoId,
      wateringIntervalDays: input.wateringIntervalDays,
      updatedAt: nowIso(),
    }

    await putRecord(STORES.plants, plant)
    return plant
  },

  async remove(plant: Plant, reminders: Reminder[]) {
    await Promise.all([
      deleteRecord(STORES.plants, plant.id),
      ...reminders
        .filter((reminder) => reminder.targetType === 'plant' && reminder.targetId === plant.id)
        .map((reminder) => deleteRecord(STORES.reminders, reminder.id)),
    ])
  },
}
