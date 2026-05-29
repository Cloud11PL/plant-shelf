import type { Plant, Shelf, WateringTarget } from '../../types/domain'
import type { PhotoUrls } from '../../types/ui'
import { eyebrowClass, mutedClass } from '../../utils/styles'
import { plantToTarget, shelfToTarget } from '../../utils/watering'
import { Button } from '../ui/button'
import { Card, CardHeader, CardTitle } from '../ui/card'
import { SwipePlantRow } from './SwipePlantRow'

export function ShelfDetail(props: {
  photoUrls: PhotoUrls
  selectedPlant?: Plant
  shelf: Shelf
  shelfPlants: Plant[]
  onAddPlant: () => void
  onDeletePlant: (plant: Plant) => void
  onDeleteShelf: (shelf: Shelf) => void
  onEditPlant: (plant: Plant) => void
  onEditShelf: (shelf: Shelf) => void
  onSelectPlant: (plant: Plant) => void
  onWaterTarget: (target: WateringTarget) => void
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="grid items-stretch gap-3">
        <div>
          <p className={eyebrowClass}>On this shelf</p>
          <CardTitle>{props.shelf.name}</CardTitle>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Button className="px-2" size="sm" variant="outline" type="button" onClick={() => props.onEditShelf(props.shelf)}>
            Tweak
          </Button>
          <Button className="px-2" size="sm" type="button" onClick={() => props.onWaterTarget(shelfToTarget(props.shelf))}>
            Watered
          </Button>
          <Button className="px-2" size="sm" variant="destructive" type="button" onClick={() => props.onDeleteShelf(props.shelf)}>
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
              shelf={props.shelf}
              onDelete={() => props.onDeletePlant(plant)}
              onEdit={() => props.onEditPlant(plant)}
              onSelect={() => props.onSelectPlant(plant)}
              onWater={() => props.onWaterTarget(plantToTarget(plant, props.shelf))}
            />
          ))
        )}
      </div>

      <button
        className="mt-3 flex w-full items-center justify-between rounded-2xl border border-dashed border-[#a44a3f]/30 bg-[#f6f4d2]/55 px-4 py-3 text-left font-black text-[#34251f]"
        type="button"
        onClick={props.onAddPlant}
      >
        <span>Add plant</span>
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#d4e09b] text-xl">+</span>
      </button>
    </Card>
  )
}
