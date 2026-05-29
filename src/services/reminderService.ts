import type { Reminder } from '../types/domain'
import { nowIso } from '../utils/dates'
import { putRecord, STORES } from '../storage/indexedDb'

export const reminderService = {
  async markDelivered(reminders: Reminder[]) {
    const deliveredAt = nowIso()

    await Promise.all(
      reminders.map((reminder) => putRecord(STORES.reminders, {
        ...reminder,
        status: 'delivered',
        deliveredAt,
        updatedAt: deliveredAt,
      })),
    )
  },
}
