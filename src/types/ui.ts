import type { EntityId } from './domain'

export interface PhotoUrls {
  [photoId: EntityId]: string
}

export interface PlantFormState {
  shelfId: EntityId
  name: string
  species: string
  note: string
  intervalDays: string
  photo?: File
}

export interface QuickStartFormState {
  shelfName: string
  plantName: string
}

export type RelativeReminderValue = '5h' | '1d' | '3d' | '7d' | '14d' | 'custom'

export interface RelativeReminderOption {
  value: RelativeReminderValue
  label: string
}
