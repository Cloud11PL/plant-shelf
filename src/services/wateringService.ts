import type { EntityId, Reminder, WateringEvent, WateringTargetType } from '../types/domain'
import { nowIso } from '../utils/dates'
import { createId } from '../utils/ids'
import { deleteRecord, putRecord, STORES } from '../storage/indexedDb'

export const wateringService = {
  async markWatered(input: {
    targetType: WateringTargetType
    targetId: EntityId
    nextReminderAt: string
    predictionSource: WateringEvent['predictionSource']
    existingReminders: Reminder[]
  }) {
    const timestamp = nowIso()
    const event: WateringEvent = {
      id: createId(),
      targetType: input.targetType,
      targetId: input.targetId,
      wateredAt: timestamp,
      nextReminderAt: input.nextReminderAt,
      predictionSource: input.predictionSource,
      createdAt: timestamp,
    }
    const reminder: Reminder = {
      id: createId(),
      targetType: input.targetType,
      targetId: input.targetId,
      dueAt: input.nextReminderAt,
      status: 'pending',
      createdAt: timestamp,
      updatedAt: timestamp,
    }
    const staleReminders = input.existingReminders.filter(
      (item) => item.targetType === input.targetType && item.targetId === input.targetId && item.status === 'pending',
    )

    await Promise.all([
      putRecord(STORES.wateringEvents, event),
      putRecord(STORES.reminders, reminder),
      ...staleReminders.map((item) => deleteRecord(STORES.reminders, item.id)),
    ])

    return { event, reminder }
  },
}
