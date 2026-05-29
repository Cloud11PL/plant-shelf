import type { EntityId, Plant } from '../types/domain'
import { nowIso } from '../utils/dates'
import { createId } from '../utils/ids'
import { putRecord, STORES } from '../storage/indexedDb'

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
}
