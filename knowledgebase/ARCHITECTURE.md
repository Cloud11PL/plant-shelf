# Architecture Specification

## Technical Context

The project is a React + TypeScript + Vite PWA. The current setup already includes `vite-plugin-pwa`, a custom service worker entry, and Workbox precaching.

Version 1 should remain a local-first app. It will rely on the storage available to the installed PWA on the user's phone for both structured records and photos. The architecture should still use explicit services and repositories so the local persistence adapter can later be replaced or complemented by a backend API.

## Layering

Use four practical layers:

- UI layer: React components, screens, forms, and navigation.
- Application service layer: user-facing operations such as creating plants, marking watering, and scheduling reminders.
- Repository layer: persistence interfaces for shelves, plants, photos, watering events, and reminders.
- Infrastructure adapters: IndexedDB/local storage, browser notification APIs, service worker integration, and future API clients.

UI components should call services, not directly read or write browser storage.

## Code Organization

Keep files small and contextual from the first implementation.

- Store shared domain types in dedicated type files.
- Store generic date, formatting, id, and status helpers in utility files.
- Keep services focused on one responsibility per file, such as photo storage, watering, prediction, notifications, or repositories.
- Keep React components grouped by context or feature area, such as shelves, watering, settings, and shared UI.
- Keep `App` responsible for composition and top-level state orchestration only.
- Use Tailwind utility classes for application styling. Avoid large feature-specific CSS files unless a browser integration or third-party component truly needs one.
- Add code comments only where they explain an important non-obvious decision, browser limitation, or data migration concern.

## shadcn Migration Plan

Plan to migrate shared UI primitives to shadcn/ui once the core flows stabilize.

- Introduce shadcn with Tailwind CSS as the styling foundation.
- Start with shared primitives only: Button, Input, Textarea, Label, Card, Badge, Dialog/Drawer, Tabs, and Toast.
- Keep feature components in their current contextual folders; use shadcn primitives inside them rather than moving feature logic into the UI library folder.
- Replace repeated utility class constants gradually after matching the current visual language.
- Do not migrate domain hooks, services, repositories, or storage code as part of the shadcn work.

## PWA Device Storage

Use IndexedDB as the preferred local database for v1 because the app needs structured records and local photo references inside phone PWA storage. A small wrapper library can be introduced during implementation if desired, but the documented boundary should be repository interfaces rather than a library-specific API.

Photos should be stored locally as blobs or object references managed by a photo storage service. Domain records should store photo ids, not embedded base64 strings.

The implementation should treat PWA storage as durable enough for the offline v1 experience, but not as cloud backup. If the user uninstalls the app, clears site data, changes browser, or the operating system evicts storage, local data may be removed. Future export, import, or backend sync can address that limitation.

## Domain Types

```ts
type EntityId = string

type WateringTargetType = 'shelf' | 'plant'

type ReminderStatus =
  | 'pending'
  | 'delivered'
  | 'dismissed'
  | 'completed'
  | 'cancelled'

interface Shelf {
  id: EntityId
  name: string
  photoId?: EntityId
  wateringIntervalDays?: number
  nextReminderAt?: string
  createdAt: string
  updatedAt: string
}

interface Plant {
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

interface WateringEvent {
  id: EntityId
  targetType: WateringTargetType
  targetId: EntityId
  wateredAt: string
  nextReminderAt?: string
  predictionSource?: 'history' | 'targetInterval' | 'shelfDefault' | 'manual'
  createdAt: string
}

interface Reminder {
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
```

Dates should be stored as ISO strings. UI formatting should be handled at the presentation layer.

## Services

### Shelf Service

Responsible for creating, updating, deleting, listing, and reading shelves. It also exposes shelf summaries with plant count and watering status.

### Plant Service

Responsible for creating, updating, deleting, moving, listing, and reading plants. It resolves shelf relationships but does not own shelf persistence.

### Photo Storage Service

Responsible for saving, reading, replacing, and deleting photos in phone PWA storage. It returns photo ids that can be attached to shelves or plants.

### Watering Service

Responsible for marking shelves or plants as watered. It creates watering events, requests a prediction, stores the selected next reminder time, and updates reminder records.

### Notification Scheduler

Responsible for permission state, scheduling local reminder work, and grouping due reminders into notifications.

Browser notification support varies across platforms, especially on mobile. The implementation should isolate those details behind this service so fallback behavior can be added without touching product flows.

### Prediction Service

Responsible for suggesting the next watering time based on previous watering events and configured intervals. It must return a suggestion with a source so the UI can explain it.

## Notification Grouping Rule

The scheduler should group pending reminders whose due times fall within a `+/- 4h` window of the notification being prepared.

Grouped notifications must include exact target names. The scheduler can build notification text by resolving reminder target ids through the shelf and plant repositories.

Example:

```ts
interface NotificationGroup {
  dueAt: string
  reminders: Reminder[]
  title: string
  body: string
}
```

## Future Backend Compatibility

Future server sync should be added by implementing new repository adapters and sync orchestration. UI components and application services should keep calling the same service interfaces.

Do not bake PWA/browser storage details into React components. Do not make entity ids depend on IndexedDB keys. Use generated string ids that can later be accepted by a backend or mapped during sync.
