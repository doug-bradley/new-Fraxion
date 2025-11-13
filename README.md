# Vue 3 + Vite + Kendo Drawer + Heroicons + Permissions

## Quick start
```bash
npm i
npm run dev
```

- Left nav uses Kendo Drawer, Heroicons, and Tailwind.
- Permissions/roles via Pinia (`src/stores/auth.ts`). Update to match your backend.
- Mini-collapsed mode with hover-to-peek; state persisted with `src/stores/ui.ts`.
- Router guards enforce per-route `meta.perm`.

> Kendo packages require a license (trial works locally).
