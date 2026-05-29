import { useMemo, useState } from 'react'
import { notificationScheduler } from '../services/notificationScheduler'
import { toWateringTargets } from '../utils/watering'
import { useAppData } from './useAppData'
import { useCollectionActions } from './useCollectionActions'
import { usePhotoUrls } from './usePhotoUrls'
import { useWateringActions } from './useWateringActions'

export type View = 'shelves' | 'watering' | 'settings'

export function usePlantTracker() {
  const [view, setView] = useState<View>('shelves')
  const [notice, setNotice] = useState('')
  const { data, isLoading, refreshData } = useAppData()
  const collection = useCollectionActions(data, refreshData, setNotice)
  const photoUrls = usePhotoUrls(data)
  const targets = useMemo(() => toWateringTargets(data.shelves, data.plants), [data.plants, data.shelves])
  const reminderGroups = useMemo(
    () => notificationScheduler.buildGroups(data.reminders, targets),
    [data.reminders, targets],
  )
  const watering = useWateringActions(data, reminderGroups, refreshData, setNotice, setView)
  const scheduledCount = data.reminders.filter((reminder) => reminder.status === 'pending').length

  return {
    data,
    isLoading,
    notice,
    photoUrls,
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
