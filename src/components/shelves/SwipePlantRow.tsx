import { useState, type PointerEvent } from 'react'
import type { Plant, Shelf } from '../../types/domain'
import type { PhotoUrls } from '../../types/ui'
import { cn, mutedClass } from '../../utils/styles'
import { Photo } from '../shared/Photo'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog'

export function SwipePlantRow(props: {
  plant: Plant
  shelf: Shelf
  photoUrls: PhotoUrls
  selected: boolean
  onDelete: () => void
  onEdit: () => void
  onSelect: () => void
  onWater: () => void
}) {
  const [dragStartX, setDragStartX] = useState<number | undefined>()
  const [dragX, setDragX] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const translateX = dragStartX === undefined ? (isOpen ? -132 : 0) : Math.max(-132, Math.min(0, dragX))

  function handlePointerDown(event: PointerEvent<HTMLElement>) {
    setDragStartX(event.clientX)
    setDragX(isOpen ? -132 : 0)
  }

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    if (dragStartX === undefined) {
      return
    }

    setDragX((isOpen ? -132 : 0) + event.clientX - dragStartX)
  }

  function handlePointerUp() {
    setIsOpen(translateX < -56)
    setDragStartX(undefined)
    setDragX(0)
  }

  return (
    <article className={cn('relative overflow-hidden rounded-2xl border border-white/70 bg-[#fffdf0]/74 shadow-sm', props.selected && 'ring-2 ring-[#f19c79]/30')}>
      <div className="absolute inset-y-0 right-0 grid w-[132px] grid-cols-2">
        <button className="bg-[#d4e09b] text-sm font-black text-[#34251f]" type="button" onClick={props.onEdit}>
          Edit
        </button>
        <button className="bg-[#a44a3f] text-sm font-black text-[#fffdf0]" type="button" onClick={() => setConfirmDeleteOpen(true)}>
          Remove
        </button>
      </div>

      <div
        className="relative flex touch-pan-y items-center justify-between gap-3 bg-[#fffdf0] p-3 shadow-sm transition-transform"
        style={{ transform: `translateX(${translateX}px)` }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerCancel={handlePointerUp}
        onPointerUp={handlePointerUp}
      >
        <button className="flex min-w-0 flex-1 items-center gap-3 text-left" type="button" onClick={props.onSelect}>
          <Photo photoId={props.plant.photoId} photoUrls={props.photoUrls} label={props.plant.name} />
          <span className="min-w-0 flex-1">
            <strong className="block truncate font-black tracking-normal text-[#34251f]">{props.plant.name}</strong>
            <span className="block truncate text-sm text-[#6f5a50]">{props.plant.species || 'Mystery plant'}</span>
            <small className="text-[#775149]">{props.plant.wateringIntervalDays ? `${props.plant.wateringIntervalDays} day rhythm` : 'Uses shelf default'}</small>
          </span>
        </button>
        <Button className="shrink-0" type="button" size="sm" onClick={props.onWater}>
          Watered
        </Button>
      </div>

      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent>
          <div className="grid gap-3">
            <DialogTitle>Remove {props.plant.name}?</DialogTitle>
            <p className={mutedClass}>This will remove the plant and its watering nudges from this phone.</p>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" type="button" onClick={() => setConfirmDeleteOpen(false)}>
                Keep it
              </Button>
              <Button
                variant="destructive"
                type="button"
                onClick={() => {
                  setConfirmDeleteOpen(false)
                  setIsOpen(false)
                  props.onDelete()
                }}
              >
                Remove it
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </article>
  )
}
