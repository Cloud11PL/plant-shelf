import type { EntityId, PhotoRecord } from '../types/domain'
import { nowIso } from '../utils/dates'
import { createId } from '../utils/ids'
import { putRecord, STORES, withStore } from '../storage/indexedDb'

export const photoStorageService = {
  async save(file: File) {
    const record: PhotoRecord = {
      id: createId(),
      blob: file,
      type: file.type,
      createdAt: nowIso(),
    }

    await putRecord(STORES.photos, record)
    return record.id
  },

  async getUrl(photoId: EntityId) {
    const record = await withStore<PhotoRecord>(STORES.photos, 'readonly', (store) => store.get(photoId))

    if (!record) {
      return undefined
    }

    return URL.createObjectURL(record.blob)
  },
}
