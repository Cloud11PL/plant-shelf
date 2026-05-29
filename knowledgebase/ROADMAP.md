# Implementation Roadmap

## Phase 1: App Shell

- Replace the default Vite starter screen with a phone-first app shell.
- Add bottom navigation for shelves, watering, and settings.
- Apply the design theme from `DESIGN.md`.
- Create empty states for shelves and watering.

Acceptance criteria:

- The app opens directly to the shelf collection.
- Layout works at common phone widths.
- No starter Vite/React content remains visible.

## Phase 2: Local Domain and Data Layer

- Define domain types for shelves, plants, photos, watering events, and reminders.
- Add repository interfaces.
- Implement local persistence adapters backed by the phone's PWA storage.
- Keep React components dependent on services rather than storage APIs.
- Keep types, utilities, services, and feature components in separate contextual files.

Acceptance criteria:

- Shelves and plants can be created, read, updated, and deleted locally.
- Data remains available after refresh and offline reload while PWA storage is retained by the device/browser.
- Repository interfaces are isolated from UI components.
- `App` remains a composition layer rather than a large feature implementation file.

## Phase 3: Shelf and Plant Management

- Build shelf list and shelf detail screens.
- Build plant list within each shelf.
- Add creation and editing forms.
- Support moving a plant between shelves.
- Display watering status summaries.

Acceptance criteria:

- A user can organize plants into shelves.
- Each plant belongs to exactly one shelf.
- Shelf and plant detail screens expose the expected edit actions.

## Phase 4: Photos

- Add photo selection for shelves and plants.
- Store photos locally in PWA storage through the photo storage service.
- Display stable thumbnails in lists and detail screens.
- Support replacing and removing photos.

Acceptance criteria:

- Photos survive refresh and offline reload while PWA storage is retained by the device/browser.
- Domain records store photo ids instead of embedded image data.
- Missing photos use consistent placeholders.

## Phase 5: Watering Tracking and Prediction

- Add watering settings for shelves and plants.
- Add "mark as watered" actions.
- Store watering events.
- Suggest next reminder times from history, explicit target interval, or shelf default.
- Let the user edit the suggested reminder before saving.

Acceptance criteria:

- Marking an item as watered creates a watering event.
- The next reminder is saved only after the user accepts or edits it.
- Prediction source can be shown or logged for debugging.

## Phase 6: Notifications and PWA Behavior

- Request notification permission from a user-initiated flow.
- Schedule local watering reminders where browser support allows.
- Group reminders due within a `+/- 4h` window.
- Ensure notifications name the exact shelves and plants.
- Keep existing app data usable offline through PWA caching and local persistence.

Acceptance criteria:

- A due reminder can produce a local notification on supported devices.
- Multiple reminders in the grouping window produce one grouped notification.
- Opening the app from a notification leads to the watering context.

## Phase 7: Mobile Polish and Resilience

- Add loading, empty, and error states.
- Add undo after marking an item as watered.
- Audit tap target sizes, contrast, and text overflow.
- Test offline reload, app install behavior, and notification fallback states.
- Continue expanding shadcn-style shared UI primitives only when a feature needs them.

Acceptance criteria:

- Core flows are usable with one hand on a phone.
- The app handles denied notification permission gracefully.
- Offline state does not block local collection management.
- Feature components remain grouped by context while shared controls come from `src/components/ui`.
