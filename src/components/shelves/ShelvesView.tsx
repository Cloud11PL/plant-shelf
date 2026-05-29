import { useState } from 'react'
import { AddPlantDialog } from './AddPlantDialog'
import { AddShelfDialog } from './AddShelfDialog'
import { EditPlantDialog } from './EditPlantDialog'
import { EditShelfDialog } from './EditShelfDialog'
import { QuickStartView } from './QuickStartView'
import { ShelfDetail } from './ShelfDetail'
import { ShelfStrip } from './ShelfStrip'
import type { ShelvesViewProps } from './types'

export function ShelvesView(props: ShelvesViewProps) {
  const [addShelfOpen, setAddShelfOpen] = useState(false)
  const [addPlantOpen, setAddPlantOpen] = useState(false)

  if (props.shelves.length === 0) {
    return (
      <QuickStartView
        quickStartForm={props.quickStartForm}
        onQuickStart={props.onQuickStart}
        onQuickStartFormChange={props.onQuickStartFormChange}
      />
    )
  }

  return (
    <section className="grid gap-4">
      <ShelfStrip
        shelves={props.shelves}
        plants={props.plants}
        photoUrls={props.photoUrls}
        selectedShelf={props.selectedShelf}
        onAddShelf={() => setAddShelfOpen(true)}
        onSelectShelf={props.onSelectShelf}
      />

      {props.selectedShelf && (
        <ShelfDetail
          photoUrls={props.photoUrls}
          selectedPlant={props.selectedPlant}
          shelf={props.selectedShelf}
          shelfPlants={props.shelfPlants}
          onAddPlant={() => setAddPlantOpen(true)}
          onDeletePlant={props.onDeletePlant}
          onDeleteShelf={props.onDeleteShelf}
          onEditPlant={props.onEditPlant}
          onEditShelf={props.onEditShelf}
          onSelectPlant={props.onSelectPlant}
          onWaterTarget={props.onWaterTarget}
        />
      )}

      <AddShelfDialog
        open={addShelfOpen}
        shelfInterval={props.shelfInterval}
        shelfName={props.shelfName}
        onCreateShelf={props.onCreateShelf}
        onOpenChange={setAddShelfOpen}
        onShelfIntervalChange={props.onShelfIntervalChange}
        onShelfNameChange={props.onShelfNameChange}
        onShelfPhotoChange={props.onShelfPhotoChange}
      />

      <AddPlantDialog
        open={addPlantOpen}
        plantForm={props.plantForm}
        onCreatePlant={props.onCreatePlant}
        onOpenChange={setAddPlantOpen}
        onPlantFormChange={props.onPlantFormChange}
      />

      <EditShelfDialog
        shelfEditForm={props.shelfEditForm}
        onOpenChange={(open) => !open && props.onShelfEditFormChange(undefined)}
        onShelfEditFormChange={props.onShelfEditFormChange}
        onUpdateShelf={props.onUpdateShelf}
      />

      <EditPlantDialog
        plantEditForm={props.plantEditForm}
        shelves={props.shelves}
        onOpenChange={(open) => !open && props.onPlantEditFormChange(undefined)}
        onPlantEditFormChange={props.onPlantEditFormChange}
        onUpdatePlant={props.onUpdatePlant}
      />
    </section>
  )
}
