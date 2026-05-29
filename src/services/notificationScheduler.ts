import type { Reminder, WateringTarget } from '../types/domain'
import { targetLabel } from '../utils/watering'

export interface NotificationGroup {
  dueAt: string
  reminders: Reminder[]
  title: string
  body: string
}

export interface NotificationStatus {
  secureContext: boolean
  notificationApi: boolean
  permission: NotificationPermission | 'unsupported'
  serviceWorker: boolean
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
        title: group.length === 1 ? 'Time for water' : `${group.length} plants may want water`,
        body: `${visibleNames}${extraCount}`,
      }
    })
  },

  async requestPermission() {
    if (!window.isSecureContext) {
      return 'insecure' as const
    }

    if (!('Notification' in window)) {
      return 'unsupported' as const
    }

    return Notification.requestPermission()
  },

  async notifyDue(groups: NotificationGroup[]) {
    if (!window.isSecureContext || !('Notification' in window) || Notification.permission !== 'granted') {
      return []
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

    return dueGroups.flatMap((group) => group.reminders.map((reminder) => reminder.id))
  },

  async notifyTest() {
    if (!window.isSecureContext) {
      return 'insecure' as const
    }

    if (!('Notification' in window)) {
      return 'unsupported' as const
    }

    const permission = Notification.permission === 'default'
      ? await Notification.requestPermission()
      : Notification.permission

    if (permission !== 'granted') {
      return 'denied' as const
    }

    const title = 'Plant Tracker is ready'
    const options = {
      body: 'I can send watering nudges from this phone.',
      tag: 'plant-tracker-test',
      icon: '/favicon.svg',
    }

    try {
      const registration = await serviceWorkerReadyWithTimeout()

      if (registration) {
        await registration.showNotification(title, options)
      } else {
        new Notification(title, options)
      }
    } catch {
      new Notification(title, options)
    }

    return 'sent' as const
  },

  getStatus(): NotificationStatus {
    return {
      secureContext: window.isSecureContext,
      notificationApi: 'Notification' in window,
      permission: 'Notification' in window ? Notification.permission : 'unsupported',
      serviceWorker: 'serviceWorker' in navigator,
    }
  },
}

async function serviceWorkerReadyWithTimeout() {
  if (!('serviceWorker' in navigator)) {
    return undefined
  }

  return Promise.race<ServiceWorkerRegistration | undefined>([
    navigator.serviceWorker.ready,
    new Promise((resolve) => window.setTimeout(() => resolve(undefined), 800)),
  ])
}
