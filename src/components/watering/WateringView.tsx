import type { FormEvent } from 'react'
import type { AppData, WateringTarget } from '../../types/domain'
import type { NotificationGroup } from '../../services/notificationScheduler'
import type { RelativeReminderOption, RelativeReminderValue } from '../../types/ui'
import { formatDateTime } from '../../utils/dates'
import { cn, inputClass, mutedClass, panelClass, primaryButton } from '../../utils/styles'
import { reminderStatus, statusClass } from '../../utils/watering'

export function WateringView(props: {
  targets: WateringTarget[]
  reminders: AppData['reminders']
  groups: NotificationGroup[]
  wateringTarget?: WateringTarget
  customReminderAt: string
  predictionLabel: string
  relativeReminder: RelativeReminderValue
  reminderOptions: RelativeReminderOption[]
  onTargetSelect: (target: WateringTarget) => void
  onCustomReminderChange: (value: string) => void
  onRelativeReminderChange: (value: RelativeReminderValue) => void
  onWatered: (event: FormEvent<HTMLFormElement>) => void
}) {
  return (
    <section className="grid gap-3.5">
      <section className={panelClass}>
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="mb-1 text-xs font-extrabold uppercase tracking-normal text-[#775149]">Watering</p>
            <h2 className="m-0 text-2xl tracking-normal text-[#34251f]">Upcoming reminders</h2>
          </div>
          <span className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#cbdfbd] bg-[#fffdf0] px-3 py-2 text-[#4b372e]">{props.groups.length} groups</span>
        </div>

        <div className="grid gap-2.5">
          {props.reminders.length === 0 ? (
            <p className={mutedClass}>Mark a shelf or plant as watered to schedule the first reminder.</p>
          ) : (
            props.reminders
              .filter((reminder) => reminder.status === 'pending')
              .sort((a, b) => a.dueAt.localeCompare(b.dueAt))
              .map((reminder) => {
                const target = props.targets.find((item) => item.id === reminder.targetId && item.type === reminder.targetType)

                return (
                  <button className={cn(primaryButton, 'flex w-full items-center justify-between gap-2.5 border border-[#cbdfbd] bg-[#fffdf0] text-left')} key={reminder.id} type="button" onClick={() => target && props.onTargetSelect(target)}>
                    <span className="grid gap-0.5">
                      <strong>{target?.name ?? 'Unknown target'}</strong>
                      <small className="text-[#775149]">{target?.shelfName ?? reminder.targetType}</small>
                    </span>
                    <span className={cn('grid min-w-26 justify-items-end gap-0.5 text-sm', statusClass(reminder.dueAt))}>
                      {reminderStatus(reminder.dueAt)}
                      <small className="text-[#775149]">{formatDateTime(reminder.dueAt)}</small>
                    </span>
                  </button>
                )
              })
          )}
        </div>
      </section>

      <section className={panelClass}>
        <p className="mb-1 text-xs font-extrabold uppercase tracking-normal text-[#775149]">Grouped notification preview</p>
        {props.groups.length === 0 ? (
          <p className={mutedClass}>No grouped notification is scheduled yet.</p>
        ) : (
          props.groups.map((group) => (
            <article className="flex flex-col items-start gap-1 rounded-lg border-l-4 border-l-[#f19c79] bg-[#f6f4d2] p-2.5" key={group.dueAt}>
              <strong>{group.title}</strong>
              <p className={mutedClass}>{group.body}</p>
              <small className="text-[#775149]">{formatDateTime(group.dueAt)} - +/- 4h grouping window</small>
            </article>
          ))
        )}
      </section>

      <form className={`${panelClass} grid gap-3`} onSubmit={props.onWatered}>
        <div>
          <p className="mb-1 text-xs font-extrabold uppercase tracking-normal text-[#775149]">Log watering</p>
          <h2 className="m-0 text-2xl tracking-normal text-[#34251f]">{props.wateringTarget ? props.wateringTarget.name : 'Pick a target'}</h2>
        </div>
        <div className="grid gap-2.5">
          {props.targets.map((target) => (
            <button
              className={cn(
                primaryButton,
                'grid justify-items-start gap-1.5 border border-transparent bg-[#fffdf0] text-left',
                props.wateringTarget?.id === target.id && props.wateringTarget.type === target.type && 'border-[#a44a3f] bg-[#f6f4d2]',
              )}
              key={`${target.type}-${target.id}`}
              type="button"
              onClick={() => props.onTargetSelect(target)}
            >
              <strong>{target.name}</strong>
              <small className="text-[#775149]">{target.shelfName ?? target.type}</small>
            </button>
          ))}
        </div>
        <fieldset className="grid gap-2">
          <legend className="mb-1 text-sm font-bold text-[#4b372e]">Next reminder</legend>
          <div className="grid grid-cols-2 gap-2">
            {props.reminderOptions.map((option) => (
              <button
                className={cn(
                  primaryButton,
                  'border border-[#cbdfbd] bg-[#fffdf0]',
                  props.relativeReminder === option.value && 'border-[#a44a3f] bg-[#d4e09b]',
                )}
                key={option.value}
                type="button"
                onClick={() => props.onRelativeReminderChange(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </fieldset>
        <label className={cn('grid gap-1.5 text-sm font-bold text-[#4b372e]', props.relativeReminder !== 'custom' && 'opacity-65')}>
          Manual date and time
          <input
            className={inputClass}
            type="datetime-local"
            disabled={props.relativeReminder !== 'custom'}
            value={props.customReminderAt}
            onChange={(event) => props.onCustomReminderChange(event.target.value)}
          />
        </label>
        {props.predictionLabel && <p className={mutedClass}>Suggested: {props.predictionLabel}</p>}
        <button className={primaryButton} type="submit" disabled={!props.wateringTarget}>
          Save watering
        </button>
      </form>
    </section>
  )
}
