# Plant Tracker

Plant Tracker is an offline-first mobile PWA for organizing home plants into virtual shelves and remembering when each shelf or plant needs watering.

The app is designed for quick phone use: open it, recognize a shelf or plant by photo, mark it as watered, and get a local reminder when it needs attention again.

## Current Direction

- Mobile-first React + TypeScript + Vite PWA.
- Local-first storage for shelves, plants, photos, watering history, and reminders.
- Service-based architecture so future backend sync can replace or extend local repositories.
- Tailwind CSS for application styling.
- Watering reminders grouped when multiple plants or shelves are due within a `+/- 4h` window.
- Watering prediction shown as an editable suggestion based on history and configured intervals.

## Project Docs

Planning documents live in `knowledgebase/`:

- `PRODUCT.md` - product goals, flows, entities, offline behavior.
- `DESIGN.md` - mobile UI direction, theme, accessibility, PWA fit.
- `ARCHITECTURE.md` - storage, services, domain shape, code organization.
- `ROADMAP.md` - implementation phases and acceptance criteria.

## Development

```bash
pnpm install
pnpm dev
```

Useful checks:

```bash
pnpm lint
pnpm build
```

## Storage Model

Version 1 relies on the storage available to the installed PWA on the user's phone. That means the app works offline, but local data is not a cloud backup. Clearing site data, uninstalling the app, changing browser, or system storage eviction may remove local records and photos.

## Code Organization Rules

- Keep shared types in dedicated type files.
- Keep generic helpers in utility files.
- Keep services focused and easy to read.
- Keep components grouped by feature context.
- Use Tailwind utilities for UI styling instead of large component CSS files.
- Keep comments rare and reserved for important browser or data behavior.
