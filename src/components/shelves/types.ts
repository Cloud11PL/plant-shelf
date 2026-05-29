import type { FormEvent } from 'react'
import type { EntityId, Plant, Shelf, WateringTarget } from '../../types/domain'
import type { PhotoUrls, PlantEditFormState, PlantFormState, QuickStartFormState, ShelfEditFormState } from '../../types/ui'

export interface ShelvesViewProps {
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
}
