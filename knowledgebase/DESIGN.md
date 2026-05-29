# Design Specification

## Design Goal

Plant Tracker is a phone-first PWA for people who want to quickly recognize where their plants are, what shelf they belong to, and when they need water. The interface should feel calm, practical, and tactile, with photos doing most of the visual work.

The app should open directly into the usable plant collection, not into a marketing or onboarding page.

## Theme

Use the existing palette as the app identity:

- `#d4e09b` - primary fresh green for active states, progress, and positive watering status.
- `#f6f4d2` - warm background surface for the main app canvas.
- `#cbdfbd` - secondary green for shelf grouping, soft highlights, and inactive states.
- `#f19c79` - attention color for due-soon reminders and secondary actions.
- `#a44a3f` - urgent color for overdue watering, destructive actions, and warning text.

The UI should avoid becoming a one-color green app. Use warm neutrals for structure, plant photos for variety, and reserve the orange/red tones for timing and priority.

## Mobile Layout

The app is designed primarily for one-handed phone use.

- Use a bottom navigation bar for the main areas: shelves, watering, and settings.
- Keep primary actions near the bottom of the screen when possible.
- Prefer dense but readable lists and grids over large marketing-style sections.
- Use photos as first-class identifiers for shelves and plants.
- Support empty states that immediately lead to creation actions.

Recommended first screen:

- Header with app name and current watering summary.
- Shelf list or shelf grid with photo thumbnails.
- Compact "due today" strip for plants or shelves needing attention.
- Floating or bottom action for adding a shelf or plant.

## Visual Components

### Shelves

Shelves should look like practical containers for plants, not decorative cards inside cards.

- Show shelf photo, shelf name, plant count, and watering status.
- Include the next due watering time if the shelf has a default watering requirement.
- Make shelf rows/cards tappable and optimized for quick scanning.

### Plants

Plant items should emphasize recognition.

- Show plant photo, name, optional species, shelf name, and watering status.
- Surface whether the plant follows the shelf default or has custom watering settings.
- Provide a clear "watered" action from detail and watering-focused views.

### Watering Status

Use consistent status labels and colors:

- `OK` for no action needed.
- `Due soon` for reminders approaching within the next day.
- `Due now` for the active reminder window.
- `Overdue` for missed watering reminders.

Status should be visible without relying on color alone. Pair color with text or iconography.

## Interaction Principles

- Adding a shelf should require only a name; photo and watering defaults are optional.
- Adding a plant should require only a name and shelf; photo and custom watering settings are optional.
- Marking an item as watered should be a single intentional action with undo available immediately after.
- When watering a shelf, the UI should clearly explain whether the action waters only the shelf reminder or also selected plants.
- Prediction suggestions should be editable before saving.

## Photos

Photos are essential for orientation inside the home.

- Allow one primary photo per shelf.
- Allow one primary photo per plant.
- Store photos locally in the phone's PWA storage in v1.
- Use neutral placeholders when no photo exists.
- Crop thumbnails consistently so lists stay stable.

## Accessibility

- Keep tap targets at least 44px high.
- Ensure color contrast is readable on the warm background.
- Do not use color as the only indicator of watering state.
- Preserve keyboard and screen-reader semantics for forms and buttons.
- Respect reduced motion preferences.

## PWA Fit

The installed app should feel native enough for daily use:

- Full-screen mobile layout with no dependency on desktop navigation.
- Offline-ready screens for existing shelves, plants, photos, and watering history.
- Clear permission prompt timing for notifications, shown only after the user understands the watering reminder feature.
