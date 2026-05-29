export type EntityId = string

export type WateringTargetType = 'shelf' | 'plant'

export type ReminderStatus =
  | 'pending'
  | 'delivered'
  | 'dismissed'
  | 'completed'
  | 'cancelled'

export interface Shelf {
  id: EntityId
  name: string
  photoId?: EntityId
  wateringIntervalDays?: number
  nextReminderAt?: string
  createdAt: string
  updatedAt: string
}

export interface Plant {
  id: EntityId
  shelfId: EntityId
  name: string
  species?: string
  note?: string
  photoId?: EntityId
  wateringIntervalDays?: number
  nextReminderAt?: string
  createdAt: string
  updatedAt: string
}

export interface WateringEvent {
  id: EntityId
  targetType: WateringTargetType
  targetId: EntityId
  wateredAt: string
  nextReminderAt?: string
  predictionSource?: 'history' | 'targetInterval' | 'shelfDefault' | 'manual'
  createdAt: string
}

export interface Reminder {
  id: EntityId
  targetType: WateringTargetType
  targetId: EntityId
  dueAt: string
  status: ReminderStatus
  deliveredAt?: string
  completedAt?: string
  createdAt: string
  updatedAt: string
}

export interface PhotoRecord {
  id: EntityId
  blob: Blob
  type: string
  createdAt: string
}

export interface AppData {
  shelves: Shelf[]
  plants: Plant[]
  wateringEvents: WateringEvent[]
  reminders: Reminder[]
}

export interface WateringTarget {
  id: EntityId
  type: WateringTargetType
  name: string
  shelfName?: string
  photoId?: EntityId
  intervalDays?: number
  nextReminderAt?: string
}
