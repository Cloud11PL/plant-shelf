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

export interface PlantEditFormState extends PlantFormState {
  id: EntityId
}

export interface QuickStartFormState {
  shelfName: string
  plantName: string
}

export interface ShelfEditFormState {
  id: EntityId
  name: string
  intervalDays: string
  photo?: File
}

export type RelativeReminderValue = '5h' | '1d' | '3d' | '7d' | '14d' | 'custom'

export interface RelativeReminderOption {
  value: RelativeReminderValue
  label: string
}

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}
