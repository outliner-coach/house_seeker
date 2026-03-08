# Functions Prototype

Last updated: 2026-03-08

Purpose:
- Cloud Functions and task workers for the first prototype

Planned ownership:
- task queue handlers
- analysis adapter
- trusted write utilities
- cleanup handlers

Suggested future structure:
- `src/tasks/`
- `src/analysis/`
- `src/http/`
- `src/utils/`

Coordination note:
- start with a provider-agnostic analysis adapter and a mock implementation
