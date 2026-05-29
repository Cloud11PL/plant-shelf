import { type FormEvent, useState } from 'react'
import { notificationScheduler } from '../services/notificationScheduler'
import { predictionService } from '../services/predictionService'
import { wateringService } from '../services/wateringService'
import type { AppData, WateringEvent, WateringTarget } from '../types/domain'
import type { NotificationGroup } from '../services/notificationScheduler'
import type { RelativeReminderOption, RelativeReminderValue } from '../types/ui'
import { toDatetimeLocalValue } from '../utils/dates'
import { fallbackCustomReminderValue, nextReminderIsoFromRelative, relativeValueFromSuggestion } from '../utils/reminders'
import { labelPredictionSource } from '../utils/watering'

const baseReminderOptions: RelativeReminderOption[] = [
  { value: '5h', label: 'In 5 hours' },
  { value: '1d', label: 'In 1 day' },
  { value: '3d', label: 'In 3 days' },
  { value: '7d', label: 'In 7 days' },
  { value: '14d', label: 'In 14 days' },
  { value: 'custom', label: 'Manual date' },
]

export function useWateringActions(
  data: AppData,
  reminderGroups: NotificationGroup[],
  refreshData: () => Promise<void>,
  setNotice: (notice: string) => void,
  setView: (view: 'shelves' | 'watering' | 'settings') => void,
) {
  const [wateringTarget, setWateringTarget] = useState<WateringTarget | undefined>()
  const [relativeReminder, setRelativeReminder] = useState<RelativeReminderValue>('7d')
  const [customReminderAt, setCustomReminderAt] = useState(fallbackCustomReminderValue())
  const [predictionSource, setPredictionSource] = useState<WateringEvent['predictionSource']>('manual')
  const [predictionLabel, setPredictionLabel] = useState('')
  const [reminderOptions, setReminderOptions] = useState<RelativeReminderOption[]>(baseReminderOptions)

  function openWatering(target: WateringTarget) {
    const plant = target.type === 'plant' ? data.plants.find((item) => item.id === target.id) : undefined
    const shelf = plant ? data.shelves.find((item) => item.id === plant.shelfId) : undefined
    const suggestion = predictionService.suggest(target, data.wateringEvents, shelf)
    const suggestedRelative = relativeValueFromSuggestion(suggestion.days)

    setWateringTarget(target)
    setRelativeReminder(suggestedRelative)
    setCustomReminderAt(toDatetimeLocalValue(suggestion.dueAt))
    setPredictionSource(suggestion.source)
    setPredictionLabel(`${suggestion.days} days, based on ${labelPredictionSource(suggestion.source)}.`)
    setReminderOptions(markSuggestedOption(suggestedRelative))
    setView('watering')
  }

  async function handleWatered(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!wateringTarget) {
      return
    }

    await wateringService.markWatered({
      targetType: wateringTarget.type,
      targetId: wateringTarget.id,
      nextReminderAt: nextReminderIsoFromRelative(relativeReminder, customReminderAt),
      predictionSource,
      existingReminders: data.reminders,
    })

    setNotice(`${wateringTarget.name} marked as watered.`)
    setWateringTarget(undefined)
    setRelativeReminder('7d')
    setCustomReminderAt(fallbackCustomReminderValue())
    setPredictionSource('manual')
    setPredictionLabel('')
    setReminderOptions(baseReminderOptions)
    await refreshData()
  }

  async function handlePermissionRequest() {
    const permission = await notificationScheduler.requestPermission()
    setNotice(permission === 'unsupported' ? 'Notifications are not supported in this browser.' : `Notification permission: ${permission}.`)
  }

  async function handleNotifyDue() {
    const count = await notificationScheduler.notifyDue(reminderGroups)
    setNotice(count > 0 ? `${count} due notification group sent.` : 'No due reminders to notify right now.')
  }

  return {
    customReminderAt,
    predictionLabel,
    relativeReminder,
    reminderOptions,
    wateringTarget,
    actions: {
      notifyDue: handleNotifyDue,
      requestPermission: handlePermissionRequest,
      setCustomReminderAt,
      setRelativeReminder,
      waterTarget: openWatering,
      watered: handleWatered,
    },
  }
}

function markSuggestedOption(value: RelativeReminderValue) {
  return baseReminderOptions.map((option) => ({
    ...option,
    label: option.value === value && option.value !== 'custom' ? `${option.label} (suggested)` : option.label,
  }))
}
