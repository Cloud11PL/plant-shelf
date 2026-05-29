import type { FormEvent } from 'react'
import type { Shelf } from '../../types/domain'
import type { PlantEditFormState } from '../../types/ui'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'

export function EditPlantDialog(props: {
  plantEditForm?: PlantEditFormState
  shelves: Shelf[]
  onOpenChange: (open: boolean) => void
  onPlantEditFormChange: (value?: PlantEditFormState) => void
  onUpdatePlant: (event: FormEvent<HTMLFormElement>) => void
}) {
  function updateForm(patch: Partial<PlantEditFormState>) {
    if (!props.plantEditForm) {
      return
    }

    props.onPlantEditFormChange({ ...props.plantEditForm, ...patch })
  }

  return (
    <Dialog open={Boolean(props.plantEditForm)} onOpenChange={props.onOpenChange}>
      <DialogContent>
        {props.plantEditForm && (
          <form className="grid gap-3" onSubmit={props.onUpdatePlant}>
            <DialogTitle>Tweak this plant</DialogTitle>
            <Label>
              Plant name
              <Input value={props.plantEditForm.name} onChange={(event) => updateForm({ name: event.target.value })} />
            </Label>
            <Label>
              Move to shelf
              <select
                className="w-full rounded-xl border border-[#cbdfbd] bg-[#fffef7]/90 px-3.5 py-3 text-[#34251f] shadow-inner shadow-[#cbdfbd]/20 outline-none transition focus:border-[#a44a3f] focus:ring-2 focus:ring-[#f19c79]/25"
                value={props.plantEditForm.shelfId}
                onChange={(event) => updateForm({ shelfId: event.target.value })}
              >
                {props.shelves.map((shelf) => (
                  <option key={shelf.id} value={shelf.id}>
                    {shelf.name}
                  </option>
                ))}
              </select>
            </Label>
            <Label>
              What kind is it?
              <Input value={props.plantEditForm.species} onChange={(event) => updateForm({ species: event.target.value })} placeholder="Optional" />
            </Label>
            <Label>
              Its own watering rhythm
              <Input min="1" type="number" value={props.plantEditForm.intervalDays} onChange={(event) => updateForm({ intervalDays: event.target.value })} />
            </Label>
            <Label>
              Change the photo
              <Input accept="image/*" type="file" onChange={(event) => updateForm({ photo: event.target.files?.[0] })} />
            </Label>
            <Label>
              Note
              <Textarea value={props.plantEditForm.note} onChange={(event) => updateForm({ note: event.target.value })} />
            </Label>
            <Button type="submit">Looks good</Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
