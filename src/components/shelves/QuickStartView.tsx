import type { FormEvent } from 'react'
import type { QuickStartFormState } from '../../types/ui'
import { eyebrowClass } from '../../utils/styles'
import { Button } from '../ui/button'
import { Card, CardDescription, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

export function QuickStartView(props: {
  quickStartForm: QuickStartFormState
  onQuickStart: (event: FormEvent<HTMLFormElement>) => void
  onQuickStartFormChange: (value: QuickStartFormState) => void
}) {
  return (
    <section className="grid gap-4">
      <Card className="overflow-hidden">
        <form className="relative grid gap-4 p-5" onSubmit={props.onQuickStart}>
          <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#d4e09b]/55 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-[#f19c79]/28 blur-2xl" />
          <div className="relative">
            <p className={eyebrowClass}>Let's start small</p>
            <CardTitle className="text-[1.8rem]">Where do your plants live?</CardTitle>
            <CardDescription className="mt-2 text-base leading-6">
              Start with one shelf, windowsill, or corner. Add a plant now if you already know which one goes there.
            </CardDescription>
          </div>

          <Label>
            Spot name
            <Input
              value={props.quickStartForm.shelfName}
              onChange={(event) => props.onQuickStartFormChange({ ...props.quickStartForm, shelfName: event.target.value })}
              placeholder="Kitchen window"
            />
          </Label>

          <Label>
            First plant there
            <Input
              value={props.quickStartForm.plantName}
              onChange={(event) => props.onQuickStartFormChange({ ...props.quickStartForm, plantName: event.target.value })}
              placeholder="Monstera, basil, fern..."
            />
          </Label>

          <Button type="submit">Start my shelf</Button>
        </form>
      </Card>
    </section>
  )
}
