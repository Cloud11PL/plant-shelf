import type { Reminder, WateringTarget } from '../types/domain'
import { targetLabel } from '../utils/watering'

export interface NotificationGroup {
  dueAt: string
  reminders: Reminder[]
  title: string
  body: string
}

export const notificationScheduler = {
  buildGroups(reminders: Reminder[], targets: WateringTarget[]): NotificationGroup[] {
    const pending = reminders
      .filter((reminder) => reminder.status === 'pending')
      .sort((a, b) => a.dueAt.localeCompare(b.dueAt))
    const groups: Reminder[][] = []

    pending.forEach((reminder) => {
      const reminderTime = new Date(reminder.dueAt).getTime()
      const group = groups.find((items) => {
        const anchor = new Date(items[0].dueAt).getTime()
        return Math.abs(reminderTime - anchor) <= 4 * 60 * 60 * 1000
      })

      if (group) {
        group.push(reminder)
      } else {
        groups.push([reminder])
      }
    })

    return groups.map((group) => {
      const names = group.map((reminder) => targetLabel(reminder, targets)).filter(Boolean)
      const visibleNames = names.slice(0, 3).join(', ')
      const extraCount = names.length > 3 ? ` +${names.length - 3} more` : ''

      return {
        dueAt: group[0].dueAt,
        reminders: group,
        title: group.length === 1 ? 'Watering due' : `${group.length} watering tasks due`,
        body: `${visibleNames}${extraCount}`,
      }
    })
  },

  async requestPermission() {
    if (!('Notification' in window)) {
      return 'unsupported' as const
    }

    return Notification.requestPermission()
  },

  async notifyDue(groups: NotificationGroup[]) {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return 0
    }

    const now = Date.now()
    const dueGroups = groups.filter((group) => new Date(group.dueAt).getTime() <= now)

    dueGroups.forEach((group) => {
      navigator.serviceWorker.ready
        .then((registration) => registration.showNotification(group.title, {
          body: group.body,
          tag: `watering-${group.dueAt}`,
          icon: '/favicon.svg',
        }))
        .catch(() => {
          new Notification(group.title, { body: group.body, tag: `watering-${group.dueAt}` })
        })
    })

    return dueGroups.length
  },
}
