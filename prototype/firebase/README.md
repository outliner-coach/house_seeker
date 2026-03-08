# Firebase Prototype

Last updated: 2026-03-08

Purpose:
- Firebase project configuration and local development setup for the first prototype

Current ownership:
- Firebase config
- emulator setup
- Firestore rules
- Storage rules
- indexes

Current files:
- `firebase.json`
- `.firebaserc`
- `firestore.rules`
- `storage.rules`
- `firestore.indexes.json`

Deployment note:
- root-level `.firebaserc` and `firebase.json` are now used for live deploy commands
- files in this folder remain the source for rules, indexes, and Firebase-specific prototype assets

Key baseline assumptions:
- replace the placeholder project id in `.firebaserc` before live deployment
- household membership documents live at `households/{householdId}/members/{uid}`
- Storage access mirrors Firestore household membership checks

Useful commands:
- `pnpm emulators`
- `pnpm firebase:deploy:rules`
- `pnpm firebase:deploy:hosting`

Coordination note:
- changes here affect every agent, so keep tasks small and explicit
