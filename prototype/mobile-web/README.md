# Mobile Web Prototype

Last updated: 2026-03-08

Purpose:
- React + Vite mobile web application for the first prototype

Current ownership:
- app shell
- routes
- screens
- feature modules
- Firebase client integration

Current baseline:
- `src/app/`
- `src/features/`
- `src/components/`
- `src/lib/firebase/`
- `src/styles/`
- `.env.example`

Implemented so far:
- protected shell with bottom-tab navigation
- sign-in page with email-link and Google auth actions
- Firebase client initialization from `VITE_FIREBASE_*`
- household bootstrap wiring is active

Useful commands:
- `pnpm dev:web`
- `pnpm build:web`
- `pnpm lint:web`

Coordination note:
- feature work should follow `workflow/implementation-plan.md`
