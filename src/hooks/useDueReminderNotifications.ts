import { useEffect, useRef } from 'react'
import type { Reminder } from '../types/domain'
import type { NotificationGroup } from '../services/notificationScheduler'
import { notificationScheduler } from '../services/notificationScheduler'
import { reminderService } from '../services/reminderService'

export function useDueReminderNotifications(
  reminders: Reminder[],
  groups: NotificationGroup[],
  refreshData: () => Promise<void>,
) {
  const lastRunRef = useRef(0)

  useEffect(() => {
    async function notifyDueReminders() {
      if (document.visibilityState === 'hidden') {
        return
      }

      if (!('Notification' in window) || Notification.permission !== 'granted') {
        return
      }

      const now = Date.now()

      if (now - lastRunRef.current < 30_000) {
        return
      }

      lastRunRef.current = now

      const deliveredReminderIds = await notificationScheduler.notifyDue(groups)

      if (deliveredReminderIds.length === 0) {
        return
      }

      await reminderService.markDelivered(
        reminders.filter((reminder) => deliveredReminderIds.includes(reminder.id)),
      )
      await refreshData()
    }

    void notifyDueReminders()

    window.addEventListener('focus', notifyDueReminders)
    document.addEventListener('visibilitychange', notifyDueReminders)

    return () => {
      window.removeEventListener('focus', notifyDueReminders)
      document.removeEventListener('visibilitychange', notifyDueReminders)
    }
  }, [groups, refreshData, reminders])
}
