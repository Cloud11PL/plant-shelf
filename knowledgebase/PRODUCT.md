# Product Specification

## Product Goal

Plant Tracker helps a user organize home plants into virtual shelves and remember when each shelf or plant needs watering. The app is built for quick phone use at home: open it, recognize the shelf or plant by photo, mark watering, and leave.

Version 1 is offline-first and single-user. All data and photos are stored in the storage available to the installed PWA on the user's phone. The app should still be structured so future server sync can be added without rewriting product flows.

## Core Concepts

### Shelf

A shelf represents a physical place in the home where plants are grouped. Examples: kitchen window, living room shelf, bedroom stand.

A shelf can have:

- Name.
- Optional photo.
- Optional default watering interval.
- Optional next reminder.
- Many plants.

### Plant

A plant belongs to exactly one shelf.

A plant can have:

- Name.
- Optional species.
- Optional note.
- Optional photo.
- Optional custom watering interval.
- Optional next reminder.

If a plant has no custom watering settings, it may inherit the shelf default for display and suggestion purposes.

### Watering Requirement

A watering requirement describes how often a shelf or plant should be watered. It should be expressed in days for v1, with a user-editable next reminder date and time.

### Watering Event

A watering event is created when the user marks a shelf or plant as watered. The event stores when watering happened and what next reminder was chosen.

### Reminder

A reminder is the scheduled watering alert for a shelf or plant. It can be pending, delivered, dismissed, completed, or cancelled.

## Primary User Flows

### Add a Shelf

1. User taps add shelf.
2. User enters shelf name.
3. User optionally adds a photo.
4. User optionally sets a default watering interval.
5. Shelf appears in the shelf list.

### Add a Plant

1. User opens a shelf or taps add plant.
2. User enters plant name.
3. User selects or confirms shelf.
4. User optionally adds species, note, photo, and custom watering interval.
5. Plant appears under the shelf.

### Mark as Watered

1. User opens a plant, shelf, or watering view.
2. User taps "watered".
3. App records a watering event.
4. App suggests a next reminder based on previous watering behavior.
5. User accepts or edits the next reminder.
6. App schedules or updates the local reminder.

Prediction must be a visible suggestion, not a silent automatic override.

### Review Upcoming Watering

1. User opens the watering view.
2. App groups items by status: overdue, due today, upcoming.
3. User can open each shelf or plant from the list.
4. User can mark one item or multiple grouped items as watered.

### Receive Reminder

1. User receives a local notification.
2. Notification names the exact shelf or plant that needs watering.
3. If multiple items are due within the grouping window, notification summarizes the group and lists the exact affected items.
4. User opens the app and lands in the watering context.

## Notification Grouping

When multiple reminders are due within a `+/- 4h` window, the app should group them into one notification.

The grouped notification must still identify the exact shelves and plants, for example:

> Watering due: Kitchen Window, Monstera, Bedroom Shelf

If the list is too long for the notification body, show a count and the first few names, then show the full list in the app.

## Watering Prediction

The app should use previous watering events to suggest the next reminder.

For v1:

- Use the user's recent watering intervals for the same plant or shelf.
- Prefer the target's explicit interval if there is not enough history.
- Fall back to the shelf default for plants without custom settings.
- Always let the user edit the suggested date and time before saving.

The prediction feature is meant to reduce typing, not to make autonomous plant-care decisions.

## Offline Behavior

The app must work without network access after installation.

- Existing shelves, plants, photos, reminders, and watering history remain available offline.
- Creating and editing local data works offline.
- Structured data and photos are stored locally in the phone's PWA/browser storage.
- Notifications are local device reminders.
- Server accounts, sync, sharing, and multi-device conflict resolution are out of scope for v1.
- If the operating system or browser clears site storage, the app may lose local data in v1; backup/export can be considered later.

## Success Criteria

- A user can map their home plant collection into shelves.
- A user can recognize shelves and plants visually through photos.
- A user can track watering at shelf or plant level.
- A user gets useful local reminders that name the exact target.
- A user can accept or edit predicted next watering times.
