import type { EntityId } from '../../types/domain'
import type { PhotoUrls } from '../../types/ui'

export function Photo(props: { photoId?: EntityId; photoUrls: PhotoUrls; label: string }) {
  const url = props.photoId ? props.photoUrls[props.photoId] : undefined

  if (url) {
    return <img className="h-16 w-16 flex-none rounded-2xl border border-white/70 bg-[#cbdfbd] object-cover shadow-md shadow-[#4c372e]/10" src={url} alt="" />
  }

  return (
    <span className="grid h-16 w-16 flex-none place-items-center rounded-2xl border border-white/70 bg-gradient-to-br from-[#d4e09b] to-[#cbdfbd] text-2xl font-black text-[#4b372e] shadow-md shadow-[#4c372e]/10" aria-hidden="true">
      {props.label.slice(0, 1).toUpperCase()}
    </span>
  )
}
