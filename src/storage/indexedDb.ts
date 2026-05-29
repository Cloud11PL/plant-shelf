import type { EntityId } from '../types/domain'

const DB_NAME = 'plant-tracker-pwa'
const DB_VERSION = 1

export const STORES = {
  shelves: 'shelves',
  plants: 'plants',
  wateringEvents: 'wateringEvents',
  reminders: 'reminders',
  photos: 'photos',
} as const

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const db = request.result
      Object.values(STORES).forEach((storeName) => {
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id' })
        }
      })
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function withStore<T>(
  storeName: string,
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T> | void,
): Promise<T | undefined> {
  const db = await openDb()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, mode)
    const store = transaction.objectStore(storeName)
    const request = run(store)
    let result: T | undefined

    if (request) {
      request.onsuccess = () => {
        result = request.result
      }
      request.onerror = () => reject(request.error)
    }

    transaction.oncomplete = () => {
      db.close()
      resolve(result)
    }
    transaction.onerror = () => {
      db.close()
      reject(transaction.error)
    }
  })
}

export async function getAll<T>(storeName: string): Promise<T[]> {
  const records = await withStore<T[]>(storeName, 'readonly', (store) => store.getAll())
  return records ?? []
}

export async function putRecord<T extends { id: EntityId }>(storeName: string, record: T) {
  await withStore(storeName, 'readwrite', (store) => store.put(record))
}

export async function deleteRecord(storeName: string, id: EntityId) {
  await withStore(storeName, 'readwrite', (store) => store.delete(id))
}
