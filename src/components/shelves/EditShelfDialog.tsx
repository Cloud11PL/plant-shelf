import type { FormEvent } from 'react'
import type { ShelfEditFormState } from '../../types/ui'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

export function EditShelfDialog(props: {
  shelfEditForm?: ShelfEditFormState
  onOpenChange: (open: boolean) => void
  onShelfEditFormChange: (value?: ShelfEditFormState) => void
  onUpdateShelf: (event: FormEvent<HTMLFormElement>) => void
}) {
  function updateForm(patch: Partial<ShelfEditFormState>) {
    if (!props.shelfEditForm) {
      return
    }

    props.onShelfEditFormChange({ ...props.shelfEditForm, ...patch })
  }

  return (
    <Dialog open={Boolean(props.shelfEditForm)} onOpenChange={props.onOpenChange}>
      <DialogContent>
        {props.shelfEditForm && (
          <form className="grid gap-3" onSubmit={props.onUpdateShelf}>
            <DialogTitle>Tweak this shelf</DialogTitle>
            <Label>
              Shelf name
              <Input value={props.shelfEditForm.name} onChange={(event) => updateForm({ name: event.target.value })} />
            </Label>
            <Label>
              Usual watering rhythm
              <Input min="1" type="number" value={props.shelfEditForm.intervalDays} onChange={(event) => updateForm({ intervalDays: event.target.value })} />
            </Label>
            <Label>
              Change the photo
              <Input accept="image/*" type="file" onChange={(event) => updateForm({ photo: event.target.files?.[0] })} />
            </Label>
            <Button type="submit">Looks good</Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
