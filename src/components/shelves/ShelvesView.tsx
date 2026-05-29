import type { FormEvent } from 'react'
import type { EntityId, Plant, Shelf, WateringTarget } from '../../types/domain'
import type { PhotoUrls, PlantFormState, QuickStartFormState } from '../../types/ui'
import { cn, inputClass, mutedClass, panelClass, primaryButton } from '../../utils/styles'
import { plantToTarget, shelfToTarget } from '../../utils/watering'
import { Photo } from '../shared/Photo'

export function ShelvesView(props: {
  shelves: Shelf[]
  plants: Plant[]
  photoUrls: PhotoUrls
  selectedShelf?: Shelf
  shelfPlants: Plant[]
  shelfName: string
  shelfInterval: string
  plantForm: PlantFormState
  quickStartForm: QuickStartFormState
  onShelfNameChange: (value: string) => void
  onShelfIntervalChange: (value: string) => void
  onShelfPhotoChange: (value?: File) => void
  onCreateShelf: (event: FormEvent<HTMLFormElement>) => void
  onQuickStart: (event: FormEvent<HTMLFormElement>) => void
  onSelectShelf: (shelfId: EntityId) => void
  onDeleteShelf: (shelf: Shelf) => void
  onPlantFormChange: (value: PlantFormState) => void
  onQuickStartFormChange: (value: QuickStartFormState) => void
  onCreatePlant: (event: FormEvent<HTMLFormElement>) => void
  onWaterTarget: (target: WateringTarget) => void
}) {
  if (props.shelves.length === 0) {
    return <QuickStartView {...props} />
  }

  return (
    <section className="grid gap-3.5">
      <form className={`${panelClass} grid gap-3`} onSubmit={props.onCreateShelf}>
        <div>
          <p className="mb-1 text-xs font-extrabold uppercase tracking-normal text-[#775149]">New shelf</p>
          <h2 className="m-0 text-2xl tracking-normal text-[#34251f]">Add a place</h2>
        </div>
        <label className="grid gap-1.5 text-sm font-bold text-[#4b372e]">
          Shelf name
          <input className={inputClass} value={props.shelfName} onChange={(event) => props.onShelfNameChange(event.target.value)} placeholder="Kitchen window" />
        </label>
        <label className="grid gap-1.5 text-sm font-bold text-[#4b372e]">
          Default watering interval
          <input
            className={inputClass}
            min="1"
            type="number"
            value={props.shelfInterval}
            onChange={(event) => props.onShelfIntervalChange(event.target.value)}
            placeholder="Days"
          />
        </label>
        <label className="grid gap-1.5 text-sm font-bold text-[#4b372e]">
          Shelf photo
          <input className={inputClass} accept="image/*" type="file" onChange={(event) => props.onShelfPhotoChange(event.target.files?.[0])} />
        </label>
        <button className={primaryButton} type="submit">Add shelf</button>
      </form>

      <section className="grid auto-cols-[minmax(136px,42%)] grid-flow-col gap-2.5 overflow-x-auto pb-0.5" aria-label="Shelves">
        {props.shelves.map((shelf) => {
          const plantCount = props.plants.filter((plant) => plant.shelfId === shelf.id).length

          return (
            <button
              className={cn(
                primaryButton,
                'grid justify-items-start gap-1.5 border border-transparent bg-[#fffdf0] text-left',
                props.selectedShelf?.id === shelf.id && 'border-[#a44a3f] bg-[#f6f4d2]',
              )}
              key={shelf.id}
              type="button"
              onClick={() => props.onSelectShelf(shelf.id)}
            >
              <Photo photoId={shelf.photoId} photoUrls={props.photoUrls} label={shelf.name} />
              <span>{shelf.name}</span>
              <small className="text-[#775149]">{plantCount} plants</small>
            </button>
          )
        })}
      </section>

      {props.selectedShelf && (
        <section className={panelClass}>
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="mb-1 text-xs font-extrabold uppercase tracking-normal text-[#775149]">Selected shelf</p>
              <h2 className="m-0 text-2xl tracking-normal text-[#34251f]">{props.selectedShelf.name}</h2>
            </div>
            <div className="flex gap-2">
              <button className={primaryButton} type="button" onClick={() => props.onWaterTarget(shelfToTarget(props.selectedShelf!))}>
                Watered
              </button>
              <button className={cn(primaryButton, 'bg-[#a44a3f] text-[#fffdf0]')} type="button" onClick={() => props.onDeleteShelf(props.selectedShelf!)}>
                Remove
              </button>
            </div>
          </div>

          <form className="my-3 grid gap-3 sm:grid-cols-2" onSubmit={props.onCreatePlant}>
            <label className="grid gap-1.5 text-sm font-bold text-[#4b372e]">
              Plant name
              <input
                className={inputClass}
                value={props.plantForm.name}
                onChange={(event) => props.onPlantFormChange({ ...props.plantForm, name: event.target.value })}
                placeholder="Monstera"
              />
            </label>
            <label className="grid gap-1.5 text-sm font-bold text-[#4b372e]">
              Species
              <input
                className={inputClass}
                value={props.plantForm.species}
                onChange={(event) => props.onPlantFormChange({ ...props.plantForm, species: event.target.value })}
                placeholder="Optional"
              />
            </label>
            <label className="grid gap-1.5 text-sm font-bold text-[#4b372e]">
              Custom interval
              <input
                className={inputClass}
                min="1"
                type="number"
                value={props.plantForm.intervalDays}
                onChange={(event) => props.onPlantFormChange({ ...props.plantForm, intervalDays: event.target.value })}
                placeholder="Days"
              />
            </label>
            <label className="grid gap-1.5 text-sm font-bold text-[#4b372e]">
              Photo
              <input
                className={inputClass}
                accept="image/*"
                type="file"
                onChange={(event) => props.onPlantFormChange({ ...props.plantForm, photo: event.target.files?.[0] })}
              />
            </label>
            <label className="grid gap-1.5 text-sm font-bold text-[#4b372e] sm:col-span-2">
              Note
              <textarea
                className={`${inputClass} min-h-[74px] resize-y`}
                value={props.plantForm.note}
                onChange={(event) => props.onPlantFormChange({ ...props.plantForm, note: event.target.value })}
                placeholder="Light, soil, or care notes"
              />
            </label>
            <button className={primaryButton} type="submit">Add plant</button>
          </form>

          <div className="grid gap-2.5">
            {props.shelfPlants.length === 0 ? (
              <p className={mutedClass}>This shelf is ready for its first plant.</p>
            ) : (
              props.shelfPlants.map((plant) => (
                <article className="flex items-center justify-between gap-3 rounded-lg bg-[#f6f4d2] p-2.5" key={plant.id}>
                  <Photo photoId={plant.photoId} photoUrls={props.photoUrls} label={plant.name} />
                  <div className="min-w-0 flex-1">
                    <h3 className="m-0 tracking-normal text-[#34251f]">{plant.name}</h3>
                    <p className={mutedClass}>{plant.species || 'Unknown species'}</p>
                    <small className="text-[#775149]">{plant.wateringIntervalDays ? `${plant.wateringIntervalDays} day rhythm` : 'Uses shelf default'}</small>
                  </div>
                  <button className={primaryButton} type="button" onClick={() => props.onWaterTarget(plantToTarget(plant, props.selectedShelf))}>
                    Watered
                  </button>
                </article>
              ))
            )}
          </div>
        </section>
      )}
    </section>
  )
}

function QuickStartView(props: {
  quickStartForm: QuickStartFormState
  onQuickStart: (event: FormEvent<HTMLFormElement>) => void
  onQuickStartFormChange: (value: QuickStartFormState) => void
}) {
  return (
    <section className="grid gap-3.5">
      <form className={`${panelClass} grid gap-3`} onSubmit={props.onQuickStart}>
        <div>
          <p className="mb-1 text-xs font-extrabold uppercase tracking-normal text-[#775149]">First setup</p>
          <h2 className="m-0 text-2xl tracking-normal text-[#34251f]">Add your first shelf</h2>
          <p className={mutedClass}>Start with one place in your home. Add a first plant now or leave it for later.</p>
        </div>

        <label className="grid gap-1.5 text-sm font-bold text-[#4b372e]">
          Shelf name
          <input
            className={inputClass}
            value={props.quickStartForm.shelfName}
            onChange={(event) => props.onQuickStartFormChange({ ...props.quickStartForm, shelfName: event.target.value })}
            placeholder="Kitchen window"
          />
        </label>

        <label className="grid gap-1.5 text-sm font-bold text-[#4b372e]">
          First plant
          <input
            className={inputClass}
            value={props.quickStartForm.plantName}
            onChange={(event) => props.onQuickStartFormChange({ ...props.quickStartForm, plantName: event.target.value })}
            placeholder="Monstera, basil, fern..."
          />
        </label>

        <button className={primaryButton} type="submit">
          Create first shelf
        </button>
      </form>
    </section>
  )
}
