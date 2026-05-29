import { useState, type FormEvent, type PointerEvent } from 'react'
import type { EntityId, Plant, Shelf, WateringTarget } from '../../types/domain'
import type { PhotoUrls, PlantEditFormState, PlantFormState, QuickStartFormState, ShelfEditFormState } from '../../types/ui'
import { cn, eyebrowClass, mutedClass } from '../../utils/styles'
import { plantToTarget, shelfToTarget } from '../../utils/watering'
import { Photo } from '../shared/Photo'
import { Button } from '../ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'

export function ShelvesView(props: {
  shelves: Shelf[]
  plants: Plant[]
  photoUrls: PhotoUrls
  selectedShelf?: Shelf
  shelfPlants: Plant[]
  shelfName: string
  shelfInterval: string
  plantForm: PlantFormState
  plantEditForm?: PlantEditFormState
  shelfEditForm?: ShelfEditFormState
  quickStartForm: QuickStartFormState
  selectedPlant?: Plant
  onShelfNameChange: (value: string) => void
  onShelfIntervalChange: (value: string) => void
  onShelfPhotoChange: (value?: File) => void
  onCreateShelf: (event: FormEvent<HTMLFormElement>) => void
  onQuickStart: (event: FormEvent<HTMLFormElement>) => void
  onSelectShelf: (shelfId: EntityId) => void
  onDeleteShelf: (shelf: Shelf) => void
  onEditShelf: (shelf: Shelf) => void
  onPlantFormChange: (value: PlantFormState) => void
  onPlantEditFormChange: (value?: PlantEditFormState) => void
  onShelfEditFormChange: (value?: ShelfEditFormState) => void
  onQuickStartFormChange: (value: QuickStartFormState) => void
  onCreatePlant: (event: FormEvent<HTMLFormElement>) => void
  onUpdatePlant: (event: FormEvent<HTMLFormElement>) => void
  onUpdateShelf: (event: FormEvent<HTMLFormElement>) => void
  onSelectPlant: (plant: Plant) => void
  onEditPlant: (plant: Plant) => void
  onDeletePlant: (plant: Plant) => void
  onWaterTarget: (target: WateringTarget) => void
}) {
  const [addShelfOpen, setAddShelfOpen] = useState(false)
  const [addPlantOpen, setAddPlantOpen] = useState(false)

  if (props.shelves.length === 0) {
    return <QuickStartView {...props} />
  }

  function updatePlantEditForm(patch: Partial<PlantEditFormState>) {
    if (!props.plantEditForm) {
      return
    }

    props.onPlantEditFormChange({ ...props.plantEditForm, ...patch })
  }

  function updateShelfEditForm(patch: Partial<ShelfEditFormState>) {
    if (!props.shelfEditForm) {
      return
    }

    props.onShelfEditFormChange({ ...props.shelfEditForm, ...patch })
  }

  return (
    <section className="grid gap-4">
      <section className="shelf-strip grid auto-cols-[minmax(154px,44%)] grid-flow-col gap-3 overflow-x-auto px-0.5 pb-1.5" aria-label="Shelves">
        {props.shelves.map((shelf) => {
          const plantCount = props.plants.filter((plant) => plant.shelfId === shelf.id).length

          return (
            <Button
              className={cn(
                'grid h-auto justify-items-start gap-2 rounded-2xl border-white/70 bg-[#fffdf0]/78 p-3 text-left shadow-[0_12px_28px_rgba(76,55,46,0.1)]',
                props.selectedShelf?.id === shelf.id && 'border-[#a44a3f]/55 bg-[#f6f4d2] ring-2 ring-[#f19c79]/25',
              )}
              key={shelf.id}
              variant="outline"
              type="button"
              onClick={() => props.onSelectShelf(shelf.id)}
            >
              <Photo photoId={shelf.photoId} photoUrls={props.photoUrls} label={shelf.name} />
              <span className="text-base font-black">{shelf.name}</span>
              <small className="rounded-full bg-[#cbdfbd]/60 px-2 py-0.5 text-[#775149]">{plantCount} plants</small>
            </Button>
          )
        })}
        <Button
          className="grid h-auto min-h-[150px] justify-items-start gap-2 rounded-2xl border-dashed border-[#a44a3f]/35 bg-[#fffdf0]/55 p-3 text-left shadow-[0_12px_28px_rgba(76,55,46,0.06)]"
          variant="outline"
          type="button"
          onClick={() => setAddShelfOpen(true)}
        >
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-[#d4e09b]/75 text-3xl font-black text-[#4b372e]">+</span>
          <span className="text-base font-black">Add shelf</span>
          <small className="text-[#775149]">Another spot</small>
        </Button>
      </section>

      {props.selectedShelf && (
        <Card className="overflow-hidden">
          <CardHeader className="grid items-stretch gap-3">
            <div>
              <p className={eyebrowClass}>On this shelf</p>
              <CardTitle>{props.selectedShelf.name}</CardTitle>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Button className="px-2" size="sm" variant="outline" type="button" onClick={() => props.onEditShelf(props.selectedShelf!)}>
                Tweak
              </Button>
              <Button className="px-2" size="sm" type="button" onClick={() => props.onWaterTarget(shelfToTarget(props.selectedShelf!))}>
                Watered
              </Button>
              <Button className="px-2" size="sm" variant="destructive" type="button" onClick={() => props.onDeleteShelf(props.selectedShelf!)}>
                Remove
              </Button>
            </div>
          </CardHeader>

          <div className="-mx-4 mb-4 h-px bg-gradient-to-r from-transparent via-[#a44a3f]/18 to-transparent" />

          <div className="grid gap-2.5">
            {props.shelfPlants.length === 0 ? (
              <p className={mutedClass}>This shelf is waiting for its first plant.</p>
            ) : (
              props.shelfPlants.map((plant) => (
                <SwipePlantRow
                  key={plant.id}
                  plant={plant}
                  photoUrls={props.photoUrls}
                  selected={props.selectedPlant?.id === plant.id}
                  shelf={props.selectedShelf!}
                  onDelete={() => props.onDeletePlant(plant)}
                  onEdit={() => props.onEditPlant(plant)}
                  onSelect={() => props.onSelectPlant(plant)}
                  onWater={() => props.onWaterTarget(plantToTarget(plant, props.selectedShelf))}
                />
              ))
            )}
          </div>

          <button
            className="mt-3 flex w-full items-center justify-between rounded-2xl border border-dashed border-[#a44a3f]/30 bg-[#f6f4d2]/55 px-4 py-3 text-left font-black text-[#34251f]"
            type="button"
            onClick={() => setAddPlantOpen(true)}
          >
            <span>Add plant</span>
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#d4e09b] text-xl">+</span>
          </button>
        </Card>
      )}

      <Dialog open={addShelfOpen} onOpenChange={setAddShelfOpen}>
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

      <Dialog open={addPlantOpen} onOpenChange={setAddPlantOpen}>
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

      <Dialog open={Boolean(props.shelfEditForm)} onOpenChange={(open) => !open && props.onShelfEditFormChange(undefined)}>
        <DialogContent>
          {props.shelfEditForm && (
            <form className="grid gap-3" onSubmit={props.onUpdateShelf}>
              <DialogTitle>Tweak this shelf</DialogTitle>
              <Label>
                Shelf name
                <Input value={props.shelfEditForm.name} onChange={(event) => updateShelfEditForm({ name: event.target.value })} />
              </Label>
              <Label>
                Usual watering rhythm
                <Input min="1" type="number" value={props.shelfEditForm.intervalDays} onChange={(event) => updateShelfEditForm({ intervalDays: event.target.value })} />
              </Label>
              <Label>
                Change the photo
                <Input accept="image/*" type="file" onChange={(event) => updateShelfEditForm({ photo: event.target.files?.[0] })} />
              </Label>
              <Button type="submit">Looks good</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(props.plantEditForm)} onOpenChange={(open) => !open && props.onPlantEditFormChange(undefined)}>
        <DialogContent>
          {props.plantEditForm && (
            <form className="grid gap-3" onSubmit={props.onUpdatePlant}>
              <DialogTitle>Tweak this plant</DialogTitle>
              <Label>
                Plant name
                <Input value={props.plantEditForm.name} onChange={(event) => updatePlantEditForm({ name: event.target.value })} />
              </Label>
              <Label>
                Move to shelf
                <select
                  className="w-full rounded-xl border border-[#cbdfbd] bg-[#fffef7]/90 px-3.5 py-3 text-[#34251f] shadow-inner shadow-[#cbdfbd]/20 outline-none transition focus:border-[#a44a3f] focus:ring-2 focus:ring-[#f19c79]/25"
                  value={props.plantEditForm.shelfId}
                  onChange={(event) => updatePlantEditForm({ shelfId: event.target.value })}
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
                <Input value={props.plantEditForm.species} onChange={(event) => updatePlantEditForm({ species: event.target.value })} placeholder="Optional" />
              </Label>
              <Label>
                Its own watering rhythm
                <Input min="1" type="number" value={props.plantEditForm.intervalDays} onChange={(event) => updatePlantEditForm({ intervalDays: event.target.value })} />
              </Label>
              <Label>
                Change the photo
                <Input accept="image/*" type="file" onChange={(event) => updatePlantEditForm({ photo: event.target.files?.[0] })} />
              </Label>
              <Label>
                Note
                <Textarea value={props.plantEditForm.note} onChange={(event) => updatePlantEditForm({ note: event.target.value })} />
              </Label>
              <Button type="submit">Looks good</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}

function SwipePlantRow(props: {
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

function QuickStartView(props: {
  quickStartForm: QuickStartFormState
  onQuickStart: (event: FormEvent<HTMLFormElement>) => void
  onQuickStartFormChange: (value: QuickStartFormState) => void
}) {
  return (
    <section className="grid gap-4">
      <Card asChild>
        <form className="relative grid gap-4 overflow-hidden p-5" onSubmit={props.onQuickStart}>
          <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#d4e09b]/55 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-[#f19c79]/28 blur-2xl" />
          <div className="relative">
            <p className={eyebrowClass}>Let's start small</p>
            <CardTitle className="text-[1.8rem]">Where do your plants live?</CardTitle>
            <CardDescription className="mt-2 text-base leading-6">Start with one shelf, windowsill, or corner. Add a plant now if you already know which one goes there.</CardDescription>
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

          <Button type="submit">
            Start my shelf
          </Button>
        </form>
      </Card>
    </section>
  )
}
