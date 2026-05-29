import { useEffect, useState } from 'react'
import { photoStorageService } from '../services/photoStorageService'
import type { AppData, EntityId } from '../types/domain'
import type { PhotoUrls } from '../types/ui'

export function usePhotoUrls(data: Pick<AppData, 'shelves' | 'plants'>) {
  const [photoUrls, setPhotoUrls] = useState<PhotoUrls>({})

  useEffect(() => {
    const photoIds = [
      ...data.shelves.map((shelf) => shelf.photoId),
      ...data.plants.map((plant) => plant.photoId),
    ].filter(Boolean) as EntityId[]
    const urlsToRevoke: string[] = []

    Promise.all(
      photoIds.map(async (photoId) => {
        const url = await photoStorageService.getUrl(photoId)
        if (url) {
          urlsToRevoke.push(url)
          return [photoId, url] as const
        }
        return undefined
      }),
    ).then((entries) => {
      const next = entries.reduce<PhotoUrls>((acc, entry) => {
        if (entry) {
          acc[entry[0]] = entry[1]
        }
        return acc
      }, {})
      setPhotoUrls(next)
    })

    return () => {
      urlsToRevoke.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [data.plants, data.shelves])

  return photoUrls
}
