import { useMemo, useState } from 'react'
import { notificationScheduler } from '../services/notificationScheduler'
import { toWateringTargets } from '../utils/watering'
import { useAppData } from './useAppData'
import { useCollectionActions } from './useCollectionActions'
import { usePhotoUrls } from './usePhotoUrls'
import { usePwaInstall } from './usePwaInstall'
import { useWateringActions } from './useWateringActions'
import { useNotificationStatus } from './useNotificationStatus'
import { useDueReminderNotifications } from './useDueReminderNotifications'

export type View = 'shelves' | 'settings'

export function usePlantTracker() {
  const [view, setView] = useState<View>('shelves')
  const [notice, setNotice] = useState('')
  const { data, isLoading, refreshData } = useAppData()
  const collection = useCollectionActions(data, refreshData, setNotice)
  const pwaInstall = usePwaInstall()
  const notificationStatus = useNotificationStatus()
  const photoUrls = usePhotoUrls(data)
  const targets = useMemo(() => toWateringTargets(data.shelves, data.plants), [data.plants, data.shelves])
  const reminderGroups = useMemo(
    () => notificationScheduler.buildGroups(data.reminders, targets),
    [data.reminders, targets],
  )
  useDueReminderNotifications(data.reminders, reminderGroups, refreshData)
  const watering = useWateringActions(data, reminderGroups, refreshData, setNotice)
  const scheduledCount = data.reminders.filter((reminder) => reminder.status === 'pending').length

  return {
    data,
    isLoading,
    notice,
    photoUrls,
    pwaInstall,
    notificationStatus,
    reminderGroups,
    scheduledCount,
    targets,
    view,
    ...collection,
    customReminderAt: watering.customReminderAt,
    predictionLabel: watering.predictionLabel,
    relativeReminder: watering.relativeReminder,
    reminderOptions: watering.reminderOptions,
    wateringTarget: watering.wateringTarget,
    actions: {
      ...collection.actions,
      ...watering.actions,
      setNotice,
      setView,
    },
  }
}
