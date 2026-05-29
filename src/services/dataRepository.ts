import type { AppData, Plant, Reminder, Shelf, WateringEvent } from '../types/domain'
import { byCreatedAt, byDueAt } from '../utils/dates'
import { getAll, STORES } from '../storage/indexedDb'

export const initialData: AppData = {
  shelves: [],
  plants: [],
  wateringEvents: [],
  reminders: [],
}

export const dataRepository = {
  async load(): Promise<AppData> {
    const [shelves, plants, wateringEvents, reminders] = await Promise.all([
      getAll<Shelf>(STORES.shelves),
      getAll<Plant>(STORES.plants),
      getAll<WateringEvent>(STORES.wateringEvents),
      getAll<Reminder>(STORES.reminders),
    ])

    return {
      shelves: shelves.sort(byCreatedAt),
      plants: plants.sort(byCreatedAt),
      wateringEvents: wateringEvents.sort(byCreatedAt),
      reminders: reminders.sort(byDueAt),
    }
  },
}
