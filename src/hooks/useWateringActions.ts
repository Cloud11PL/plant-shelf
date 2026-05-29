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
  { value: 'custom', label: 'Pick a date' },
]

export function useWateringActions(
  data: AppData,
  reminderGroups: NotificationGroup[],
  refreshData: () => Promise<void>,
  setNotice: (notice: string) => void,
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
    setPredictionLabel(`${suggestion.days} days, from ${labelPredictionSource(suggestion.source)}.`)
    setReminderOptions(markSuggestedOption(suggestedRelative))
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

    setNotice(`${wateringTarget.name} got a drink.`)
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
    setNotice(
      permission === 'insecure'
        ? 'Notifications need HTTPS or an installed app.'
        : permission === 'unsupported'
          ? 'This browser cannot send nudges.'
          : permission === 'granted'
            ? 'I can remind you now.'
            : 'No worries, reminders stay in the app.',
    )
  }

  async function handleNotifyDue() {
    const deliveredReminderIds = await notificationScheduler.notifyDue(reminderGroups)
    const count = deliveredReminderIds.length
    setNotice(count > 0 ? `${count} nudge${count === 1 ? '' : 's'} sent.` : 'Nothing needs water right now.')
  }

  async function handleTestNotification() {
    const result = await notificationScheduler.notifyTest()

    if (result === 'sent') {
      setNotice('A test nudge is on its way.')
    } else if (result === 'insecure') {
      setNotice('Notifications need HTTPS or an installed app.')
    } else if (result === 'unsupported') {
      setNotice('This browser cannot send nudges.')
    } else {
      setNotice('Notifications are off for now.')
    }
  }

  return {
    customReminderAt,
    predictionLabel,
    relativeReminder,
    reminderOptions,
    wateringTarget,
    actions: {
      closeWatering: () => setWateringTarget(undefined),
      notifyDue: handleNotifyDue,
      requestPermission: handlePermissionRequest,
      testNotification: handleTestNotification,
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
    label: option.value === value && option.value !== 'custom' ? `${option.label} - feels right` : option.label,
  }))
}
