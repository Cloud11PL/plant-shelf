import type { EntityId } from '../../types/domain'
import type { PhotoUrls } from '../../types/ui'

export function Photo(props: { photoId?: EntityId; photoUrls: PhotoUrls; label: string }) {
  const url = props.photoId ? props.photoUrls[props.photoId] : undefined

  if (url) {
    return <img className="h-[58px] w-[58px] flex-none rounded-lg bg-[#cbdfbd] object-cover" src={url} alt="" />
  }

  return (
    <span className="grid h-[58px] w-[58px] flex-none place-items-center rounded-lg bg-[#cbdfbd] text-xl font-black text-[#4b372e]" aria-hidden="true">
      {props.label.slice(0, 1).toUpperCase()}
    </span>
  )
}
