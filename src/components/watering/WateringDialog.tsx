import type { FormEvent } from 'react'
import type { WateringTarget } from '../../types/domain'
import type { RelativeReminderOption, RelativeReminderValue } from '../../types/ui'
import { cn, eyebrowClass, mutedClass } from '../../utils/styles'
import { Button } from '../ui/button'
import { CardTitle } from '../ui/card'
import { Dialog, DialogContent } from '../ui/dialog'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

export function WateringDialog(props: {
  target?: WateringTarget
  customReminderAt: string
  predictionLabel: string
  relativeReminder: RelativeReminderValue
  reminderOptions: RelativeReminderOption[]
  onClose: () => void
  onCustomReminderChange: (value: string) => void
  onRelativeReminderChange: (value: RelativeReminderValue) => void
  onWatered: (event: FormEvent<HTMLFormElement>) => void
}) {
  return (
    <Dialog open={Boolean(props.target)} onOpenChange={(open) => !open && props.onClose()}>
      <DialogContent>
        {props.target && (
          <form className="grid gap-4" onSubmit={props.onWatered}>
            <div>
              <p className={eyebrowClass}>Watered</p>
              <CardTitle>{props.target.name}</CardTitle>
              <p className={mutedClass}>Nice. When should I nudge you again?</p>
            </div>

            <fieldset className="grid gap-2">
              <legend className="mb-1 text-sm font-bold text-[#4b372e]">Remind me again</legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {props.reminderOptions.map((option) => (
                  <Button
                    className={cn(
                      'rounded-2xl border-[#cbdfbd] bg-[#fffdf0]/85 shadow-sm',
                      props.relativeReminder === option.value && 'border-[#a44a3f] bg-[#d4e09b] ring-2 ring-[#f19c79]/25',
                    )}
                    key={option.value}
                    variant="outline"
                    type="button"
                    onClick={() => props.onRelativeReminderChange(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </fieldset>

            <Label className={cn(props.relativeReminder !== 'custom' && 'opacity-65')}>
              Pick an exact time
              <Input
                type="datetime-local"
                disabled={props.relativeReminder !== 'custom'}
                value={props.customReminderAt}
                onChange={(event) => props.onCustomReminderChange(event.target.value)}
              />
            </Label>

            {props.predictionLabel && <p className={mutedClass}>My guess: {props.predictionLabel}</p>}

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" type="button" onClick={props.onClose}>
                Not now
              </Button>
              <Button type="submit">
                I watered this
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
