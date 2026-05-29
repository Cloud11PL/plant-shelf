import type { FormEvent } from 'react'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

export function AddShelfDialog(props: {
  open: boolean
  shelfInterval: string
  shelfName: string
  onCreateShelf: (event: FormEvent<HTMLFormElement>) => void
  onOpenChange: (open: boolean) => void
  onShelfIntervalChange: (value: string) => void
  onShelfNameChange: (value: string) => void
  onShelfPhotoChange: (value?: File) => void
}) {
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent>
        <form className="grid gap-3" onSubmit={props.onCreateShelf}>
          <DialogTitle>Add a shelf</DialogTitle>
          <Label>
            What do you call it?
            <Input value={props.shelfName} onChange={(event) => props.onShelfNameChange(event.target.value)} placeholder="Kitchen window" />
          </Label>
          <Label>
            Usual watering rhythm
            <Input
              min="1"
              type="number"
              value={props.shelfInterval}
              onChange={(event) => props.onShelfIntervalChange(event.target.value)}
              placeholder="Every few days"
            />
          </Label>
          <Label>
            A photo of the spot
            <Input accept="image/*" type="file" onChange={(event) => props.onShelfPhotoChange(event.target.files?.[0])} />
          </Label>
          <Button type="submit">Add this shelf</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
