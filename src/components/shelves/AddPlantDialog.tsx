import type { FormEvent } from 'react'
import type { PlantFormState } from '../../types/ui'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'

export function AddPlantDialog(props: {
  open: boolean
  plantForm: PlantFormState
  onCreatePlant: (event: FormEvent<HTMLFormElement>) => void
  onOpenChange: (open: boolean) => void
  onPlantFormChange: (value: PlantFormState) => void
}) {
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent>
        <form className="grid gap-3" onSubmit={props.onCreatePlant}>
          <DialogTitle>Add a plant</DialogTitle>
          <Label>
            Plant name
            <Input
              value={props.plantForm.name}
              onChange={(event) => props.onPlantFormChange({ ...props.plantForm, name: event.target.value })}
              placeholder="Monstera"
            />
          </Label>
          <Label>
            What kind is it?
            <Input
              value={props.plantForm.species}
              onChange={(event) => props.onPlantFormChange({ ...props.plantForm, species: event.target.value })}
              placeholder="Optional, no pressure"
            />
          </Label>
          <Label>
            Its own watering rhythm
            <Input
              min="1"
              type="number"
              value={props.plantForm.intervalDays}
              onChange={(event) => props.onPlantFormChange({ ...props.plantForm, intervalDays: event.target.value })}
              placeholder="Every few days"
            />
          </Label>
          <Label>
            Plant photo
            <Input
              accept="image/*"
              type="file"
              onChange={(event) => props.onPlantFormChange({ ...props.plantForm, photo: event.target.files?.[0] })}
            />
          </Label>
          <Label>
            Note
            <Textarea
              value={props.plantForm.note}
              onChange={(event) => props.onPlantFormChange({ ...props.plantForm, note: event.target.value })}
              placeholder="Light, soil, little quirks..."
            />
          </Label>
          <Button type="submit">Add this plant</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
