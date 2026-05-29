import type { EntityId, Plant, Shelf } from '../../types/domain'
import type { PhotoUrls } from '../../types/ui'
import { cn } from '../../utils/styles'
import { Photo } from '../shared/Photo'
import { Button } from '../ui/button'

export function ShelfStrip(props: {
  shelves: Shelf[]
  plants: Plant[]
  photoUrls: PhotoUrls
  selectedShelf?: Shelf
  onAddShelf: () => void
  onSelectShelf: (shelfId: EntityId) => void
}) {
  return (
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
        onClick={props.onAddShelf}
      >
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-[#d4e09b]/75 text-3xl font-black text-[#4b372e]">+</span>
        <span className="text-base font-black">Add shelf</span>
        <small className="text-[#775149]">Another spot</small>
      </Button>
    </section>
  )
}
